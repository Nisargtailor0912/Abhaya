const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');

content = content.replace(
  'className="flex flex-col items-center justify-center w-full"',
  'className="flex flex-col items-center justify-center w-full" style={{ transformStyle: "preserve-3d" }}'
);

content = content.replace(
  'className="relative w-full max-w-sm h-24 bg-rose-500/20 dark:bg-rose-900/30 backdrop-blur-2xl rounded-full border border-rose-500/30 overflow-hidden flex items-center px-2 shadow-[0_8px_32px_rgba(244,63,94,0.15)]"',
  'className="relative w-full max-w-sm h-24 bg-rose-500/20 dark:bg-rose-900/30 backdrop-blur-2xl rounded-full border border-rose-500/30 overflow-hidden flex items-center px-2 shadow-[0_8px_32px_rgba(244,63,94,0.15)]" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}'
);

content = content.replace(
  '        <motion.div\n          drag="x"',
  '        <motion.div\n          style={{ touchAction: "none", transform: "translateZ(30px)" }}\n          drag="x"'
);

// We need to be careful not to override the style prop completely if it already has one.
// Let's just use replace on the class string.
fs.writeFileSync('src/components/SlideToSOS.tsx', content);
