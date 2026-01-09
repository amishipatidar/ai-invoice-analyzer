import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

try {
  if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Check for the specific doubled scheme issue
    if (content.includes('MONGO_URI=mongodb:mongodb')) {
      console.log('Found malformed URI: mongodb:mongodb...');
      const newContent = content.replace('MONGO_URI=mongodb:mongodb', 'MONGO_URI=mongodb');
      fs.writeFileSync(envPath, newContent, 'utf8');
      console.log('✅ Fixed MONGO_URI in .env');
    } else {
      console.log('ℹ️ Pattern "MONGO_URI=mongodb:mongodb" not found. Checking for other variations...');
      if (content.includes('MONGO_URI=mongodb: mongodb')) {
          const newContent = content.replace('MONGO_URI=mongodb: mongodb', 'MONGO_URI=mongodb');
          fs.writeFileSync(envPath, newContent, 'utf8');
          console.log('✅ Fixed MONGO_URI (removed space/dup) in .env');
      } else {
          console.log('No obvious malformed pattern found requiring fix.');
      }
    }
  } else {
    console.error('❌ .env file not found');
  }
} catch (error) {
  console.error('❌ Error fixing .env:', error);
}
