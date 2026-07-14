const fs = require('fs');
let auth = fs.readFileSync('src/components/Auth.tsx', 'utf8');

auth = auth.replace(/<motion\.div[^>]*className="[^"]*blur-\[100px\][^"]*"[\s\S]*?\/>/g, '');
fs.writeFileSync('src/components/Auth.tsx', auth);
