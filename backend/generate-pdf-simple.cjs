const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument({
    pdfVersion: '1.5', // Try setting a specific version
    autoFirstPage: true
});

const stream = fs.createWriteStream('test_invoice_generated.pdf');
doc.pipe(stream);

doc.text('INVOICE', 100, 50);
doc.text('Invoice Number: INV-TEST-001', 100, 100);
doc.text('Date: 2025-12-13', 100, 120);
doc.text('Vendor: Tech Solutions Inc.', 100, 140);
doc.text('Total: $1870.00', 100, 160);

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully');
});
