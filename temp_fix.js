const fs = require('fs');

// Read the file content
let content = fs.readFileSync('./client/src/components/yoga-vision-simplified.tsx', 'utf8');

// Replace all occurrences of the max height
content = content.replace(/maxHeight: "220px"/g, 'maxHeight: "228px" /* 8px taller */');

// Write the modified content back to the file
fs.writeFileSync('./client/src/components/yoga-vision-simplified.tsx', content);

console.log('File updated successfully!');
