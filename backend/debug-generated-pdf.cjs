const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('test_invoice_generated.pdf');

pdf(dataBuffer).then(function(data) {
    console.log('Successfully parsed PDF!');
    console.log('Text content:', data.text);
}).catch(function(error) {
    console.error('Error parsing PDF:', error);
});
