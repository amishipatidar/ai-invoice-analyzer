const pdf = require('pdf-parse');
const fs = require('fs');

const buffer = fs.readFileSync('C:\\Users\\HP\\Desktop\\sample_invoice.pdf');

try {
    console.log('Trying new pdf.PDFParse(buffer)...');
    const instance = new pdf.PDFParse(buffer);
    console.log('Instance created:', instance);
    if (instance.text) {
        console.log('Text found via instance.text');
    } else if (typeof instance.then === 'function') {
        console.log('Instance is a promise');
        instance.then(data => console.log('Data from promise:', data.text ? 'Text found' : 'No text'));
    } else {
        console.log('Instance keys:', Object.keys(instance));
    }
} catch (e) {
    console.log('Error with new pdf.PDFParse:', e.message);
}

try {
    console.log('Trying pdf.PDFParse(buffer)...');
    const result = pdf.PDFParse(buffer);
    console.log('Result from function call:', result);
} catch (e) {
    console.log('Error with pdf.PDFParse():', e.message);
}
