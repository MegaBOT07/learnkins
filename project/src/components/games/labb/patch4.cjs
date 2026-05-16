const fs = require('fs');
const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

content = content.replace("},,\\n    {id:'p4'", "},\\n    {id:'p4'");
content = content.replace("},,\\n    {id:'b4'", "},\\n    {id:'b4'");

fs.writeFileSync(labPath, content);
console.log("Fixed double commas!");
