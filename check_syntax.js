import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'client/src/components/tour/fundi-tour-guide.tsx');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('File loaded successfully, content length:', content.length);
  console.log('Last 100 characters:', content.slice(-100));
} catch (error) {
  console.error('Error reading file:', error);
}