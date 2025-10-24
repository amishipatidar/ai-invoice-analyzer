import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const processInvoiceWithGemini = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an AI assistant specialized in extracting structured data from invoice documents.

Extract the following information from this invoice text and return ONLY a valid JSON object (no markdown, no additional text):

{
  "invoiceNumber": "string",
  "invoiceDate": "string",
  "dueDate": "string",
  "vendorName": "string",
  "vendorAddress": "string",
  "customerName": "string",
  "customerAddress": "string",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "unitPrice": number,
      "amount": number
    }
  ],
  "subtotal": number,
  "tax": number,
  "total": number,
  "currency": "string",
  "paymentTerms": "string",
  "notes": "string"
}

Invoice Text:
${pdfText}

Return ONLY the JSON object, no other text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response (remove markdown code blocks if present)
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON
    const extractedData = JSON.parse(cleanedText);

    return extractedData;

  } catch (error) {
    console.error('Gemini processing error:', error);

    // Return mock data if Gemini fails
    return {
      invoiceNumber: 'EXTRACTED',
      invoiceDate: new Date().toISOString().split('T')[0],
      vendorName: 'Extracted from PDF',
      customerName: 'Customer Info',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      currency: 'USD',
      notes: `Extraction note: ${error.message}`
    };
  }
};