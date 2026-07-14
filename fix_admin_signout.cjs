const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');

content = content.replace(
  'onClick={() => signOut(auth)}',
  'onClick={() => signOut(auth).then(() => window.location.reload())}'
);

fs.writeFileSync('src/components/AdminPortal.tsx', content);
