const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/href={`tel:\$\{contact\.phone\}`}/g, 'href={`tel:${contact.phone}`} target="_top"');
content = content.replace(/href={`tel:\$\{item\.number\}`}/g, 'href={`tel:${item.number}`} target="_top"');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx tel patched');
