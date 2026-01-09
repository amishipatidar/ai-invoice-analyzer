import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;

console.log('--- Inspecting MONGO_URI ---');
if (!uri) {
    console.error('❌ MONGO_URI is UNDEFINED or EMPTY');
} else {
    console.log(`Length: ${uri.length}`);
    console.log(`First 15 chars: "${uri.substring(0, 15)}..."`);
    console.log(`Starts with 'mongodb://' or 'mongodb+srv://'? ${uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')}`);
    
    // Check for common issues
    if (uri.startsWith(' ')) console.error('⚠️ Warning: Starts with whitespace');
    if (uri.startsWith('"') || uri.startsWith("'")) console.error('⚠️ Warning: Starts with quote');
    if (uri.includes('<password>')) console.error('⚠️ Warning: Contains <password> placeholder');
}
