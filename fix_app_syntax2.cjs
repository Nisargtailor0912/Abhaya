const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the incorrect stealth check (might have multiple spaces)
content = content.replace(
  /  if \(stealthActive\) \{\s*return <StealthMode onExit=\{\(\) => setStealthActive\(false\)\} \/>;\s*\}/g,
  ''
);

// Add it back before the main return
content = content.replace(
  '  return (\n    <div className="min-h-screen bg-gradient-to-br from-rose-100',
  `  if (stealthActive) {
    return <StealthMode onExit={() => setStealthActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100`
);

fs.writeFileSync('src/App.tsx', content);
