import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadInvoice,
  getInvoices,
  getInvoice,
  deleteInvoice,
  exportInvoices
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes are protected
router.use(protect);

router.post('/upload', upload.single('invoice'), uploadInvoice);
router.get('/', getInvoices);
router.get('/export', exportInvoices);
router.get('/:id', getInvoice);
router.delete('/:id', deleteInvoice);

export default router;