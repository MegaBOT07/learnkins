const fs = require('fs');

const htmlContent = fs.readFileSync('VirtualLab3D.html', 'utf-8');
const bodyStart = htmlContent.indexOf('<body>') + 6;
const scriptStart = htmlContent.indexOf('<script', bodyStart);
const bodyHtml = htmlContent.substring(bodyStart, scriptStart).trim();

const appJsx = `import { useEffect, useRef } from 'react';
import './index.css';
import { initLab } from './lab.js';

function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initLab();
    }
  }, []);

  // Ensure strict identical structure to original HTML
  const rawHTML = \`${bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

  return (
    <div dangerouslySetInnerHTML={{ __html: rawHTML }} />
  );
}

export default App;
`;

fs.writeFileSync('virtual-lab/src/App.jsx', appJsx);
console.log('App.jsx fixed successfully!');
