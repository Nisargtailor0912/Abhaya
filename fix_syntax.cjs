const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/\\`/g, '`');
app = app.replace(/\\\$/g, '$');
app = app.replace(/^`/gm, ''); // remove the leading backticks added by sed
fs.writeFileSync('src/App.tsx', app);
