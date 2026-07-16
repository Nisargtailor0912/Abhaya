const fs = require('fs');
let auth = fs.readFileSync('src/components/Auth.tsx', 'utf8');

auth = auth.replace(
  "if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {\\n        onAuth(); // Trigger local mock fallback",
  "if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {\n        onAuth(); // Trigger local mock fallback"
);

fs.writeFileSync('src/components/Auth.tsx', auth);
