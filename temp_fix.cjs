const fs = require('fs');

// Read the file content
let content = fs.readFileSync('./client/src/components/yoga-vision-simplified.tsx', 'utf8');

// Replace the height value at line 335
let lines = content.split('\n');
if (lines[335-1].includes('maxHeight: "220px"')) {
  lines[335-1] = '                    maxHeight: "228px", /* 8px taller */';
}

// Replace the height value at line 385
if (lines[385-1].includes('maxHeight: "220px"')) {
  lines[385-1] = '                    maxHeight: "228px", /* 8px taller */';
}

// Write the modified content back to the file
fs.writeFileSync('./client/src/components/yoga-vision-simplified.tsx', lines.join('\n'));

console.log('File updated successfully!');
