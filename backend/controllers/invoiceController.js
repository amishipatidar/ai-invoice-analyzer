import Invoice from '../models/Invoice.js';
import { processInvoiceWithGemini } from '../utils/geminiService.js';
import { extractTextFromPDF } from '../utils/pdfProcessor.js';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

// @desc    Upload and process invoice
// @route   POST /api/invoices/upload
// @access  Private
export const uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Create invoice record
    const invoice = await Invoice.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      filePath: req.file.path,
      processingStatus: 'processing'
    });

    // Process in background (non-blocking)
    processInvoiceAsync(invoice._id, req.file.path);

    res.status(201).json({
      message: 'Invoice uploaded successfully and processing started',
      invoiceId: invoice._id,
      status: 'processing'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Background processing function
const processInvoiceAsync = async (invoiceId, filePath) => {
  try {
    // Extract text from PDF
    const pdfText = await extractTextFromPDF(filePath);

    // Process with Gemini AI
    const extractedData = await processInvoiceWithGemini(pdfText);

    // Update invoice with extracted data
    await Invoice.findByIdAndUpdate(invoiceId, {
      extractedData: {
        ...extractedData,
        rawText: pdfText
      },
      processingStatus: 'completed',
      processedAt: new Date()
    });

    console.log(`✅ Invoice ${invoiceId} processed successfully`);

  } catch (error) {
    console.error(`❌ Error processing invoice ${invoiceId}:`, error);

    await Invoice.findByIdAndUpdate(invoiceId, {
      processingStatus: 'failed',
      errorMessage: error.message
    });
  }
};

// @desc    Get all invoices for user
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-extractedData.rawText'); // Exclude raw text for performance

    res.json({
      count: invoices.length,
      invoices
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check ownership
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this invoice' });
    }

    res.json(invoice);

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check ownership
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this invoice' });
    }

    // Delete file from filesystem
    if (fs.existsSync(invoice.filePath)) {
      fs.unlinkSync(invoice.filePath);
    }

    await invoice.deleteOne();

    res.json({ message: 'Invoice deleted successfully' });

  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export invoices as CSV or JSON
// @route   GET /api/invoices/export?format=csv|json
// @access  Private
export const exportInvoices = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const invoices = await Invoice.find({
      userId: req.user._id,
      processingStatus: 'completed'
    }).select('fileName invoiceType extractedData processedAt');

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No completed invoices to export' });
    }

    // Flatten data for export
    const flattenedData = invoices.map(inv => ({
      fileName: inv.fileName,
      invoiceType: inv.invoiceType,
      invoiceNumber: inv.extractedData?.invoiceNumber || '',
      invoiceDate: inv.extractedData?.invoiceDate || '',
      vendorName: inv.extractedData?.vendorName || '',
      customerName: inv.extractedData?.customerName || '',
      subtotal: inv.extractedData?.subtotal || 0,
      tax: inv.extractedData?.tax || 0,
      total: inv.extractedData?.total || 0,
      currency: inv.extractedData?.currency || '',
      processedAt: inv.processedAt
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(flattenedData);

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=invoices.csv');
      res.send(csv);

    } else {
      res.header('Content-Type', 'application/json');
      res.header('Content-Disposition', 'attachment; filename=invoices.json');
      res.json(flattenedData);
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};