import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function createDummyPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  page.drawText('INVOICE #TEST-001', { x: 50, y: height - 50, size: 20 });
  page.drawText('Total: $500.00', { x: 50, y: height - 80, size: 15 });
  page.drawText('Vendor: Test Vendor Inc.', { x: 50, y: height - 110, size: 15 });
  
  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(__dirname, 'temp_test_invoice.pdf');
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
}

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function main() {
  console.log('--- Verifying PDF Processing with gemini-2.5-flash-lite ---');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is MISSING');
    return;
  }
  
  const tempPdfPath = await createDummyPDF();
  console.log(`✅ Created temporary PDF: ${tempPdfPath}`);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    console.log('Sending PDF to Gemini...');
    const imagePart = fileToGenerativePart(tempPdfPath, 'application/pdf');
    const prompt = "Extract the invoice number and total from this document. Return as JSON: { invoiceNumber, total }";
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response received:');
    console.log(text);
    
    if (text.includes('TEST-001') || text.includes('500')) {
        console.log('✅ Verification SUCCESS: Data extracted correctly.');
    } else {
        console.warn('⚠️ Verification PARTIAL: Response received but data might be missing.');
    }

  } catch (error) {
    console.error('❌ Verification FAILED:', error);
  } finally {
    if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
        console.log('Cleaned up temp file.');
    }
  }
}

main();
