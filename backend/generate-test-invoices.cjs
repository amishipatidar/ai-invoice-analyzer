const fs = require('fs');
const PDFDocument = require('pdfkit');

function createInvoice(filename, data) {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);

    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('INVOICE', 50, 50);
    doc.fontSize(10).text(data.vendor, 50, 80);
    doc.text(data.vendorAddress, 50, 95);

    // Invoice Details
    doc.text(`Invoice #: ${data.invoiceNumber}`, 400, 50);
    doc.text(`Date: ${data.date}`, 400, 65);
    doc.text(`Total Due: ${data.total}`, 400, 80);

    // Bill To
    doc.text('Bill To:', 50, 130);
    doc.text('Jane Smith', 50, 145);
    doc.text('789 Client Rd, Chicago, IL', 50, 160);

    // Line Items
    let y = 200;
    doc.text('Description', 50, y);
    doc.text('Amount', 400, y);
    
    doc.moveTo(50, y + 15).lineTo(500, y + 15).stroke();
    y += 30;

    data.items.forEach(item => {
        doc.text(item.desc, 50, y);
        doc.text(item.price, 400, y);
        y += 20;
    });

    doc.moveTo(50, y + 10).lineTo(500, y + 10).stroke();
    
    // Totals
    y += 30;
    doc.fontSize(12).text(`Total: ${data.total}`, 400, y);

    doc.end();
    
    stream.on('finish', () => {
        console.log(`Generated: ${filename}`);
    });
}

// Data for 3 different invoices
const invoices = [
    {
        filename: 'invoice_amazon_electronics.pdf',
        vendor: 'Amazon.com Services LLC',
        vendorAddress: '410 Terry Ave N, Seattle, WA 98109',
        invoiceNumber: 'AMZ-8842-199',
        date: 'October 24, 2025',
        total: '$129.99',
        items: [
            { desc: 'Wireless Gaming Mouse', price: '$49.99' },
            { desc: 'Mechanical Keyboard', price: '$80.00' }
        ]
    },
    {
        filename: 'invoice_uber_ride.pdf',
        vendor: 'Uber Technologies',
        vendorAddress: '1455 Market St, San Francisco, CA',
        invoiceNumber: 'UBER-TRIP-9921',
        date: 'November 05, 2025',
        total: '$45.50',
        items: [
            { desc: 'Ride to Airport', price: '$42.00' },
            { desc: 'Booking Fee', price: '$3.50' }
        ]
    },
    {
        filename: 'invoice_consulting_services.pdf',
        vendor: 'Creative Design Studio',
        vendorAddress: '123 Art Ave, Austin, TX',
        invoiceNumber: 'CDS-2025-004',
        date: 'December 10, 2025',
        total: '$2,500.00',
        items: [
            { desc: 'Logo Design Package', price: '$1,000.00' },
            { desc: 'Website UI/UX Design', price: '$1,500.00' }
        ]
    }
];

invoices.forEach(inv => createInvoice(inv.filename, inv));
