const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('INVOICE', {
    x: 50,
    y: height - 50,
    size: 30,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText('Invoice Number: INV-TEST-LIB-001', { x: 50, y: height - 100, size: 12, font: font });
  page.drawText('Date: 2025-12-13', { x: 50, y: height - 120, size: 12, font: font });
  page.drawText('Vendor: Tech Solutions Inc.', { x: 50, y: height - 140, size: 12, font: font });
  page.drawText('Total: $1870.00', { x: 50, y: height - 160, size: 12, font: font });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('test_invoice_generated.pdf', pdfBytes);
  console.log('PDF generated successfully with pdf-lib');
}

createPdf().catch(err => console.error(err));
