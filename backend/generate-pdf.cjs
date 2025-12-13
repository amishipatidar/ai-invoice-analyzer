const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument();
const stream = fs.createWriteStream('test_invoice_generated.pdf');

doc.pipe(stream);

doc.fontSize(25).text('INVOICE', 100, 50);

doc.fontSize(12).text('Invoice Number: INV-2023-001', 100, 100);
doc.text('Date: December 13, 2025', 100, 115);
doc.text('Due Date: December 20, 2025', 100, 130);

doc.text('Vendor:', 100, 160);
doc.text('Tech Solutions Inc.', 100, 175);
doc.text('123 Tech Park, Silicon Valley, CA', 100, 190);

doc.text('Bill To:', 300, 160);
doc.text('John Doe', 300, 175);
doc.text('456 User Lane, New York, NY', 300, 190);

doc.moveDown();
doc.text('Description', 100, 250);
doc.text('Quantity', 300, 250);
doc.text('Price', 400, 250);
doc.text('Total', 500, 250);

doc.moveTo(100, 265).lineTo(550, 265).stroke();

doc.text('Web Development Services', 100, 280);
doc.text('1', 300, 280);
doc.text('$1500.00', 400, 280);
doc.text('$1500.00', 500, 280);

doc.text('Hosting (Annual)', 100, 300);
doc.text('1', 300, 300);
doc.text('$200.00', 400, 300);
doc.text('$200.00', 500, 300);

doc.moveTo(100, 330).lineTo(550, 330).stroke();

doc.text('Subtotal:', 400, 350);
doc.text('$1700.00', 500, 350);
doc.text('Tax (10%):', 400, 365);
doc.text('$170.00', 500, 365);
doc.text('Total:', 400, 380);
doc.fontSize(14).text('$1870.00', 500, 380);

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully');
});
