const fs = require('fs');
let admin = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');

admin = admin.replace(
  'onClick={() => signOut(auth).then(() => window.location.reload())}',
  'onClick={() => { localStorage.removeItem("localMockAuth"); signOut(auth).catch(()=>{}); window.location.reload(); }}'
);
fs.writeFileSync('src/components/AdminPortal.tsx', admin);
