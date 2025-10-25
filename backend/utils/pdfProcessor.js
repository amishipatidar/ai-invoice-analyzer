// import { createRequire } from 'module';
// import fs from 'fs/promises';

// const require = createRequire(import.meta.url);
// const pdf = require('pdf-parse');

// export const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = await fs.readFile(filePath);
//     const data = await pdf(dataBuffer);

//     if (!data.text || data.text.trim().length === 0) {
//       throw new Error('No text content found in PDF');
//     }

//     return data.text;

//   } catch (error) {
//     console.error('PDF processing error:', error);
//     throw new Error(`Failed to extract text from PDF: ${error.message}`);
//   }
// };

// import fs from 'fs/promises';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdf = require('pdf-parse');

// export const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = await fs.readFile(filePath);
//     const data = await pdf(dataBuffer);

//     if (!data.text || data.text.trim().length === 0) {
//       throw new Error('No text content found in PDF');
//     }

//     return data.text;

//   } catch (error) {
//     console.error('PDF processing error:', error);
//     throw new Error(`Failed to extract text from PDF: ${error.message}`);
//   }
// };


import { execFile } from 'child_process'; // Node's module for running external processes
import path from 'path';                 // Node's module for handling file paths
import fs from 'fs';                   // Node's file system module

// --- Calculate path to the new script ---
// Get the directory name of the current file (pdfProcessor.js)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Construct the full path to the pdfParserScript.js
const scriptPath = path.join(__dirname, 'pdfParserScript.js');
// --- End Path Calculation ---


// --- Updated function to extract text ---
export const extractTextFromPDF = (filePath) => {
  // Return a Promise because running the script is asynchronous
  return new Promise((resolve, reject) => {
    
    // Log for debugging: Show the command being attempted
    console.log(`Executing PDF parse script: node "${scriptPath}" "${filePath}"`);

    // Sanity check: Make sure the script file exists before trying to run it
    if (!fs.existsSync(scriptPath)) {
       console.error(`Error: pdfParserScript.js not found at ${scriptPath}`);
       // Reject the promise if the script is missing
       return reject(new Error('PDF parsing script not found. Deployment might be incomplete.'));
    }
     // Sanity check: Make sure the PDF file exists
    if (!fs.existsSync(filePath)) {
       console.error(`Error: PDF file to parse not found at ${filePath}`);
       // Reject the promise if the PDF file is missing
       return reject(new Error('PDF file to parse not found.'));
    }

    // --- Execute the external script ---
    // Use execFile to run 'node' with the script path and PDF path as arguments
    // Set a larger buffer in case the extracted text is very long (e.g., 10MB)
    execFile('node', [scriptPath, filePath], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      
      // --- Handle script execution results ---
      if (error) {
        // 'error' is populated if the script exits with a non-zero code or crashes
        console.error(`Script execution failed with error: ${error}`);
        console.error(`Script stderr: ${stderr}`); // Log any error output from the script
        // Reject the promise with an informative error
        return reject(new Error(`Failed to extract text from PDF via script. Stderr: ${stderr || 'N/A'}`));
      }
      if (stderr) {
        // Log any messages the script printed to stderr, even if it exited successfully
         console.warn(`Script stderr output (non-fatal): ${stderr}`);
      }

      // If no 'error', the script exited successfully (code 0)
      console.log('PDF parse script executed successfully.');
      // 'stdout' contains the text the script printed using console.log()
      // Resolve the promise with the trimmed text output
      resolve(stdout.trim());
    });
    // --- End Script Execution ---
  });
};
// --- End Function ---