import Invoice from '../models/Invoice.js';
import { processInvoiceWithGemini } from '../utils/geminiService.js';
// We need extractTextFromPDF from the *updated* pdfProcessor
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
    processInvoiceAsync(invoice._id, req.file.path, req.file.originalname);

    // Respond immediately to the user
    res.status(201).json({
      message: 'Invoice uploaded successfully and processing started',
      invoiceId: invoice._id,
      status: 'processing'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
};

// Background processing function
const processInvoiceAsync = async (invoiceId, filePath, originalName) => {
  console.log(`Processing invoice ${invoiceId} in background...`);
  try {
    // DIRECT GEMINI PROCESSING (No local parsing needed)
    // We pass the file path directly to Gemini which can read PDFs natively
    const extractedData = await processInvoiceWithGemini(filePath, 'application/pdf', originalName);

    // Update invoice with extracted data
    await Invoice.findByIdAndUpdate(invoiceId, {
      extractedData: {
        ...extractedData,
        rawText: "Processed natively by Gemini"
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
    // Check if filePath exists and is not null/undefined before attempting deletion
    if (invoice.filePath && fs.existsSync(invoice.filePath)) {
       try {
          fs.unlinkSync(invoice.filePath);
          console.log(`Deleted file: ${invoice.filePath}`);
       } catch (fileDeleteError) {
          console.error(`Error deleting file ${invoice.filePath}:`, fileDeleteError);
          // Decide if you want to proceed even if file deletion fails
       }
    } else if (invoice.filePath) {
        console.warn(`File path recorded but file not found at: ${invoice.filePath}`);
    }


    // Use deleteOne() directly on the model instance
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
      processingStatus: 'completed' // Only export completed ones
    }).select('fileName invoiceType extractedData processedAt createdAt'); // Added createdAt

    if (invoices.length === 0) {
      // Send 200 OK but with a message, not 404, as the request is valid but data is empty
      return res.status(200).json({ message: 'No completed invoices to export' });
    }

    // Flatten data for export - ensure all potential fields are handled
    const flattenedData = invoices.map(inv => ({
      invoiceId: inv._id, // Added ID
      fileName: inv.fileName || '',
      invoiceType: inv.invoiceType || 'standard',
      processingStatus: inv.processingStatus || '', // Added status
      invoiceNumber: inv.extractedData?.invoiceNumber || '',
      invoiceDate: inv.extractedData?.invoiceDate || '',
      dueDate: inv.extractedData?.dueDate || '', // Added due date
      vendorName: inv.extractedData?.vendorName || '',
      vendorAddress: inv.extractedData?.vendorAddress || '', // Added vendor address
      customerName: inv.extractedData?.customerName || '',
      customerAddress: inv.extractedData?.customerAddress || '', // Added customer address
      // Maybe summarize items instead of full detail for CSV/JSON export?
      // items: inv.extractedData?.items ? JSON.stringify(inv.extractedData.items) : '[]', // Example: stringify items
      itemCount: inv.extractedData?.items?.length || 0, // Added item count
      subtotal: inv.extractedData?.subtotal || 0,
      tax: inv.extractedData?.tax || 0,
      total: inv.extractedData?.total || 0,
      currency: inv.extractedData?.currency || '',
      paymentTerms: inv.extractedData?.paymentTerms || '', // Added payment terms
      notes: inv.extractedData?.notes || '', // Added notes
      processedAt: inv.processedAt ? inv.processedAt.toISOString() : '', // Format date
      createdAt: inv.createdAt ? inv.createdAt.toISOString() : '' // Format date
    }));

    if (format === 'csv') {
      if (flattenedData.length === 0) {
         res.header('Content-Type', 'text/csv');
         res.header('Content-Disposition', 'attachment; filename=invoices.csv');
         return res.send(''); // Send empty CSV if no data
      }
      // Explicitly define headers for CSV based on flattenedData keys
      const fields = Object.keys(flattenedData[0]);
      const parser = new Parser({ fields });
      const csv = parser.parse(flattenedData);

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=invoices.csv');
      res.send(csv);

    } else { // Default to JSON
      res.header('Content-Type', 'application/json');
      res.header('Content-Disposition', 'attachment; filename=invoices.json');
      res.json(flattenedData);
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error during export', error: error.message });
  }
};
