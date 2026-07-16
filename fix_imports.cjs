const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('Download,')) {
  app = app.replace('import { Shield, Phone, MessageSquare', 'import { Shield, Phone, MessageSquare, Download');
  fs.writeFileSync('src/App.tsx', app);
}
