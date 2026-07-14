const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');

content = content.replace(
  '          style={{ touchAction: "none" }}\n          className="w-[80px] h-[80px] bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_20px_rgba(244,63,94,0.6)]"',
  '          className="w-[80px] h-[80px] bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_20px_rgba(244,63,94,0.6)]"'
);

fs.writeFileSync('src/components/SlideToSOS.tsx', content);
