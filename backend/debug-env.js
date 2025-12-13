import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');

console.log('--- Debugging .env loading ---');
console.log('Current Directory:', process.cwd());
console.log('Expected .env Path:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file exists.');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('--- Raw Content Start ---');
  console.log(content);
  console.log('--- Raw Content End ---');
  
  const result = dotenv.config();
  console.log('dotenv.config() result:', result);
  
  if (result.error) {
    console.error('dotenv error:', result.error);
  }
  
  console.log('process.env.MONGO_URI:', process.env.MONGO_URI);
} else {
  console.error('.env file does NOT exist at expected path.');
}
