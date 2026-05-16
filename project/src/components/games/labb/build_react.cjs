const fs = require('fs');
const path = require('path');

const srcFile = 'VirtualLab3D.html';
const destDir = 'virtual-lab';
const htmlContent = fs.readFileSync(srcFile, 'utf-8');

// 1. Extract style
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
const cssContent = styleMatch ? styleMatch[1] : '';

// 2. Extract scripts
const scriptMatches = [...htmlContent.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
const mainScriptContent = scriptMatches.find(m => m[1] && m[1].trim().length > 0)[1];

// 3. Extract body HTML minus scripts
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
let bodyHtml = bodyMatch ? bodyMatch[1] : '';
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, '');

// 4. Setup React project
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
if (!fs.existsSync(path.join(destDir, 'public'))) fs.mkdirSync(path.join(destDir, 'public'));
if (!fs.existsSync(path.join(destDir, 'src'))) fs.mkdirSync(path.join(destDir, 'src'));

// Write index.css
fs.writeFileSync(path.join(destDir, 'src', 'index.css'), cssContent);

// Write lab.js
const labJs = `export function initLab() {
${mainScriptContent}
}
`;
fs.writeFileSync(path.join(destDir, 'src', 'lab.js'), labJs);

// Write App.jsx
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
fs.writeFileSync(path.join(destDir, 'src', 'App.jsx'), appJsx);

// Write index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Virtual Science Lab</title>
    <!-- Include Three.js via CDN as in original -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
fs.writeFileSync(path.join(destDir, 'index.html'), indexHtml);

// Write main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
`;
fs.writeFileSync(path.join(destDir, 'src', 'main.jsx'), mainJsx);

// Write package.json
const pkgJson = {
  "name": "virtual-lab",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
};
fs.writeFileSync(path.join(destDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

// Write vite.config.js
const viteCfg = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`;
fs.writeFileSync(path.join(destDir, 'vite.config.js'), viteCfg);

console.log('Project built successfully.');
