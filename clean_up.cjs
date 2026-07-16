const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (app.includes('const [showDownloads, setShowDownloads] = useState(false);')) {
  app = app.replace('  const [showDownloads, setShowDownloads] = useState(false);\n', '');
}
fs.writeFileSync('src/App.tsx', app);
