// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdf = require('pdf-parse'); // This loads the library
// import fs from 'fs';

// // --- NEW DEBUGGING LOG ---
// // This will run ONCE when your server starts.
// console.log("--- PDF-PARSE IMPORT DEBUG ---");
// console.log("The imported 'pdf' variable looks like this:", pdf);
// console.log("------------------------------");


// export const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);

//     // This line will fail again, which is OKAY.
//     // We just need the debug log from above.
//     const data = await pdf.default(dataBuffer);

//     return data.text;

//   } catch (error) {
//     console.error('PDF processing error:', error);
//     throw new Error('Failed to extract text from PDF');
//   }
// };

import * as pdf from 'pdf-parse'; 
import fs from 'fs';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf.default(dataBuffer);

    return data.text;

  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
