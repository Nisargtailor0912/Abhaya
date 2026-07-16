const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
if(!app.includes('showDownloads')) {
    app = app.replace(
        'const [showSettings, setShowSettings] = useState(false);',
        'const [showSettings, setShowSettings] = useState(false);\n  const [showDownloads, setShowDownloads] = useState(false);'
    );
    app = app.replace(
        'import {',
        'import { Download,'
    );
    fs.writeFileSync('src/App.tsx', app);
}
