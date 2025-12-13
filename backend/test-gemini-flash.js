import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    console.log('Using model: gemini-1.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Hello, are you working?';
    
    console.log('Sending request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Success! Gemini replied:', text);
  } catch (error) {
    console.error('Gemini API Error:', error.message);
  }
}

testGemini();
