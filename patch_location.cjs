const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }', '{ enableHighAccuracy: settings.locationAccuracy !== false, timeout: 10000, maximumAge: 0 }');
fs.writeFileSync('src/App.tsx', content);
console.log("patched location");
