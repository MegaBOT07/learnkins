const fs = require('fs');
const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

// Fix missing commas between array properties caused by repeated patching
content = content.replace(/\]\s*circuit:\[/g, '],\n  circuit:[');
content = content.replace(/\]\s*lens:\[/g, '],\n  lens:[');
content = content.replace(/\]\s*stomata:\[/g, '],\n  stomata:[');
content = content.replace(/\]\s*foodtest:\[/g, '],\n  foodtest:[');

fs.writeFileSync(labPath, content);
console.log("Commas fixed!");
