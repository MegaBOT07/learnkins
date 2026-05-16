const fs = require('fs');
const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

// Replace literal backslash-n characters with actual newlines
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(labPath, content);
console.log("Fixed literal newlines!");
