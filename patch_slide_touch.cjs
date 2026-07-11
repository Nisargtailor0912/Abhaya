const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToAnswer.tsx', 'utf8');

content = content.replace(
  'className="w-[72px] h-[72px] bg-white',
  'style={{ touchAction: "none" }}\n        className="w-[72px] h-[72px] bg-white'
);

fs.writeFileSync('src/components/SlideToAnswer.tsx', content);

content = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');
content = content.replace(
  'className="w-[80px] h-[80px] bg-gradient-to-br',
  'style={{ touchAction: "none" }}\n          className="w-[80px] h-[80px] bg-gradient-to-br'
);

fs.writeFileSync('src/components/SlideToSOS.tsx', content);

console.log('Slide touch action patched');
