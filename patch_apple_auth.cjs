const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

content = content.replace(
  "setError('Apple Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');",
  "setError('Apple Sign-In is not configured. You must configure it in Firebase Console -> Authentication -> Sign-in method using an Apple Developer Account.');"
);

content = content.replace(
  "if (err.code === 'auth/popup-closed-by-user') {",
  "if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {"
);
content = content.replace(
  "if (err.code === 'auth/popup-closed-by-user') {",
  "if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {"
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Apple auth error messages patched');
