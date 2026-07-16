const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');
content = content.replace('version="weekly"', 'version="3.57"');
fs.writeFileSync('src/components/AdminPortal.tsx', content);
