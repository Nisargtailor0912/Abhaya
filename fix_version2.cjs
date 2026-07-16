const fs = require('fs');
let content = fs.readFileSync('src/components/Map.tsx', 'utf8');
content = content.replace('version="quarterly"', 'version="3.57"');
fs.writeFileSync('src/components/Map.tsx', content);
