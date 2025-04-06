const fs = require('fs');
const filePath = 'client/src/components/chat-interface.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Replace both occurrences of the height being set with window.innerWidth condition
content = content.replace(/height = Math\.max\(e\.touches\[0\]\.clientY - rect\.top,\s*window\.innerWidth < 768 \? 200 : 300\);/g, 
  'height = Math.max(e.touches[0].clientY - rect.top, 350); // Fixed height for consistency');

fs.writeFileSync(filePath, content);
console.log('Updated chat-interface.tsx successfully');
