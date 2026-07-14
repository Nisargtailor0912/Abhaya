const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '            {/* iOS Glass Background Blob */}\n            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">\n               <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>\n               <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>\n            </div>',
  ''
);

// We replaced the glassmorphism shadow on App quick action buttons earlier with 3d. Let's fix quick actions to not have shadow glow.
// Wait, I didn't replace them back after removing TiltWrapper. Let's check them.
fs.writeFileSync('src/App.tsx', content);
