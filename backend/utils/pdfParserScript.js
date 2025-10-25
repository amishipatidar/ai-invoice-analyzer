const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: PDF file path argument is missing.');
  process.exit(1); 
}

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found at path: ${filePath}`);
  process.exit(1);
}



async function parsePdf(path) {
  try {
    
    const dataBuffer = fs.readFileSync(path);

    const data = await pdf(dataBuffer);

    console.log(data.text);

    process.exit(0); 
  } catch (error) {
    // Output any error message to standard error (stderr)
    console.error('Script Error: Failed to parse PDF:', error.message);
    process.exit(1);
  }
}
parsePdf(filePath);

