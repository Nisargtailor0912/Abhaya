const fs = require('fs');
let viteContent = fs.readFileSync('vite.config.ts', 'utf8');

// Add server: { hmr: false } inside the return block
viteContent = viteContent.replace(
  '    plugins: [',
  '    server: { hmr: false },\n    plugins: ['
);
fs.writeFileSync('vite.config.ts', viteContent);

let cssContent = fs.readFileSync('src/index.css', 'utf8');
cssContent = cssContent.replace('  perspective: 1000px;\n', '');
// Import Inter font
cssContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');\n` + cssContent;
// Set font-sans
cssContent = cssContent.replace('@theme {', '@theme {\n  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;');
fs.writeFileSync('src/index.css', cssContent);

