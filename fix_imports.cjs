const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  "import SlideToSOS from './components/SlideToSOS';",
  "import SlideToSOS from './components/SlideToSOS';\nimport TiltWrapper from './components/TiltWrapper';"
);
fs.writeFileSync('src/App.tsx', content);
