const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Revert the incorrect one
content = content.replace(
  '<div className="flex items-center gap-3 cursor-pointer" onDoubleClick={() => settings.stealthMode && setStealthActive(true)} title={settings.stealthMode ? "Double-click to activate Stealth Mode" : ""}>',
  '<div className="flex items-center gap-3">'
);

// Apply to the header specifically
content = content.replace(
  '<div className="flex items-center gap-3">\n            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/50">',
  '<div className="flex items-center gap-3 cursor-pointer select-none" onDoubleClick={() => settings.stealthMode && setStealthActive(true)} title={settings.stealthMode ? "Double-click to activate Stealth Mode" : ""}>\n            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/50">'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed stealth doubleclick');
