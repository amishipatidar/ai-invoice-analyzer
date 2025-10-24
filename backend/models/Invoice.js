import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  invoiceType: {
    type: String,
    enum: ['standard', 'tax', 'proforma', 'credit', 'debit', 'other'],
    default: 'standard'
  },
  extractedData: {
    invoiceNumber: String,
    invoiceDate: String,
    dueDate: String,
    vendorName: String,
    vendorAddress: String,
    customerName: String,
    customerAddress: String,
    items: [{
      description: String,
      quantity: Number,
      unitPrice: Number,
      amount: Number
    }],
    subtotal: Number,
    tax: Number,
    total: Number,
    currency: String,
    paymentTerms: String,
    notes: String,
    rawText: String
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processedAt: {
    type: Date
  },
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Invoice', invoiceSchema);