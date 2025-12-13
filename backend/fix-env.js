import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');

const content = `PORT=8000
MONGO_URI=mongodb://localhost:27017/ai_invoice_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=AIzaSyBeeLHwr1UP5lVQ_NY7YWAfxecsUTzkTHk
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
`;

try {
  fs.writeFileSync(envPath, content, 'utf8');
  console.log('Successfully rewrote .env with clean UTF-8 content.');
} catch (err) {
  console.error('Failed to write .env:', err);
}
