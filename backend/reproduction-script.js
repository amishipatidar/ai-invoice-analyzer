import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testModel(genAI, modelName) {
  console.log(`\n--- Testing Model: ${modelName} ---`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, just checking connection.");
    const response = await result.response;
    const text = response.text();
    console.log(`✅ SUCCESS: ${modelName} responded.`);
    console.log(`   Response: ${text.trim().substring(0, 40)}...`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${modelName}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('--- Checking Environment ---');
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is MISSING in process.env');
    return;
  }
  
  const key = process.env.GEMINI_API_KEY;
  console.log(`✅ GEMINI_API_KEY found (Length: ${key.length})`);
  console.log(`   Key: ${key.substring(0, 5)}...${key.substring(key.length - 5)}`);

  const genAI = new GoogleGenerativeAI(key);

  // Test the model discovered in the list
  // gemini-2.5-flash-lite
  const is25FlashLiteWorking = await testModel(genAI, "gemini-2.5-flash-lite");
  
  // Test gemini-pro (fallback)
  const isGeminiProWorking = await testModel(genAI, "gemini-pro");

  console.log('\n--- Summary ---');
  if (is25FlashLiteWorking) {
    console.log('✅ gemini-2.5-flash-lite works! Recommended to use this.');
  } else if (isGeminiProWorking) {
    console.log('⚠️ gemini-pro works, but might not support native PDF (needs testing).');
  } else {
    console.log('❌ All tested models failed.');
  }
}

main();
