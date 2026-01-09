import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is MISSING');
    return;
  }
  
  const key = process.env.GEMINI_API_KEY;
  console.log(`Using Key: ${key.substring(0, 5)}...`);

  // We can't list models directly via GoogleGenerativeAI helper easily in earlier versions,
  // preventing "Property 'listModels' does not exist" type errors if not exposed.
  // But let's try to fetch it via the `getGenerativeModel`'s parent or check SDK capabilities.
  // Actually, the easiest way with the installed SDK (v0.24.1 confirmed in package.json)
  // is to use the GoogleAIFileManager or just hit the REST API if the SDK doesn't expose it pleasantly.
  
  // However, v0.20+ should have a way.
  // Let's use a raw fetch to be 100% sure what the API sees, independent of SDK quirks.
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
       console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
       const text = await response.text();
       console.error(`   Body: ${text}`);
       return;
    }
    
    const data = await response.json();
    console.log('\n--- Available Models ---');
    if (!data.models) {
        console.log('No models returned.');
    } else {
        data.models.forEach(m => {
            console.log(`- ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(', ')})`);
        });
    }
    
  } catch (error) {
    console.error('❌ Network/Fetch Error:', error);
  }
}

main();
