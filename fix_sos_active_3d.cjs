const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');

content = content.replace(
  '        className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 backdrop-blur-2xl border border-white/20 dark:border-white/10 ${',
  '        style={{ transform: "translateZ(40px)" }}\n        className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 backdrop-blur-2xl border border-white/20 dark:border-white/10 ${'
);

fs.writeFileSync('src/components/SlideToSOS.tsx', content);
