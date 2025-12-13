import { processInvoiceWithGemini } from './utils/geminiService.js';

async function test() {
  console.log('Testing geminiService integration...');
  const result = await processInvoiceWithGemini('Invoice Number: 12345\nDate: 2023-10-27\nTotal: $500.00');
  console.log('Result:', JSON.stringify(result, null, 2));
}

test();
