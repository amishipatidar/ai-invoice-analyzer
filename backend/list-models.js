import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // This is a workaround since listModels isn't directly exposed in the high-level SDK easily
    // We'll try to use a known working model or just catch the error which might list models
    // Actually, let's try 'gemini-1.0-pro' which is the older stable one
    console.log('Trying gemini-1.0-pro...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.0-pro worked!');
  } catch (error) {
    console.log('Error with gemini-1.0-pro:', error.message);
  }

  try {
      console.log('Trying gemini-pro (legacy)...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hi');
      console.log('gemini-pro worked!');
  } catch (error) {
      console.log('Error with gemini-pro:', error.message);
  }
}

listModels();
