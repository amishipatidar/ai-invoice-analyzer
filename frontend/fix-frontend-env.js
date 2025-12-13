import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const content = 'VITE_API_URL=http://localhost:8000/api\n';

try {
  fs.writeFileSync(envPath, content, 'utf8');
  console.log('Successfully rewrote frontend .env with clean UTF-8 content.');
} catch (err) {
  console.error('Failed to write .env:', err);
}
