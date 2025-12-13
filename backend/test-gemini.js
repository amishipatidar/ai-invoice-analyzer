import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is missing in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = 'Hello, are you working? Reply with "Yes, I am working!"';
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Success! Gemini replied:', text);
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('The API Key is definitely invalid.');
    }
  }
}

testGemini();
