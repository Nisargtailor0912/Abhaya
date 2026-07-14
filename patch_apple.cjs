const fs = require('fs');

let content = fs.readFileSync('src/firebase.ts', 'utf8');

if (!content.includes("appleProvider.addScope('email')")) {
  content += "\nappleProvider.addScope('email');\nappleProvider.addScope('name');\n";
  fs.writeFileSync('src/firebase.ts', content);
  console.log('Patched Apple scopes');
}
