const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/hover:shadow-glow dark:hover:shadow-glow-dark /g, '');
content = content.replace(/hover:shadow-glow-dark /g, '');
content = content.replace(/hover:shadow-glow /g, '');
content = content.replace(/hover:shadow-glow/g, '');

content = content.replace(
  /blur-\[100px\]/g,
  'blur-[100px] animate-pulse-slow'
);
content = content.replace(
  /blur-\[120px\]/g,
  'blur-[120px] animate-pulse-slow'
);

fs.writeFileSync('src/App.tsx', content);

let contentAdmin = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');
contentAdmin = contentAdmin.replace(/hover:shadow-glow dark:hover:shadow-glow-dark /g, '');
contentAdmin = contentAdmin.replace(/hover:shadow-glow-dark /g, '');
contentAdmin = contentAdmin.replace(/hover:shadow-glow /g, '');
contentAdmin = contentAdmin.replace(/hover:shadow-glow/g, '');
contentAdmin = contentAdmin.replace(
  /blur-\[100px\]/g,
  'blur-[100px] animate-pulse-slow'
);
contentAdmin = contentAdmin.replace(
  /blur-\[120px\]/g,
  'blur-[120px] animate-pulse-slow'
);
fs.writeFileSync('src/components/AdminPortal.tsx', contentAdmin);

let cssContent = fs.readFileSync('src/index.css', 'utf8');
if (!cssContent.includes('animate-pulse-slow')) {
  cssContent += `
@layer utilities {
  .animate-pulse-slow {
    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: .7;
    transform: scale(1.05);
  }
}
`;
  fs.writeFileSync('src/index.css', cssContent);
}

console.log('reverted hover glows and added background pulse');
