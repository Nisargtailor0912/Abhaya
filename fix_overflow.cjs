const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  ' relative overflow-hidden z-0"',
  ' relative z-0 overflow-x-hidden"'
);

// We should also remove it from the blobs container if it flattens them, but blobs have translateZ(-100px) which means they will be behind. But overflow-hidden will flatten.
content = content.replace(
  '<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none" style={{ transform: "translateZ(-100px)" }}>',
  '<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none" style={{ transform: "translateZ(-100px)", transformStyle: "preserve-3d" }}>'
);
// Actually, if it has overflow-hidden, it flattens children. But it doesn't have 3d children. So it's fine.

fs.writeFileSync('src/App.tsx', content);
