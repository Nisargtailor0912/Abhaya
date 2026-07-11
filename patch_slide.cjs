const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToAnswer.tsx', 'utf8');

// replace maxDrag * 0.75 with maxDrag * 0.5 to make it easier
content = content.replace(
  'if (info.offset.x > maxDrag * 0.75) {',
  'if (info.offset.x > maxDrag * 0.5) {'
);

fs.writeFileSync('src/components/SlideToAnswer.tsx', content);

content = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');
content = content.replace(
  'if (info.offset.x > maxDrag * 0.8) {',
  'if (info.offset.x > maxDrag * 0.5) {'
);
fs.writeFileSync('src/components/SlideToSOS.tsx', content);

console.log('Slide threshold patched');
