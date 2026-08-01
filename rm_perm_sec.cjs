const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = app.indexOf('{/* Download & Permissions Settings */}');
if (startIdx !== -1) {
    const endStr = '</section>';
    const endIdx = app.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        app = app.substring(0, startIdx) + app.substring(endIdx + endStr.length);
        fs.writeFileSync('src/App.tsx', app);
    }
}
