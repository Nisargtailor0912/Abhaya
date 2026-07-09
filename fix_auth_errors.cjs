const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetGoogleCatch = `      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console > Authentication > Settings > Authorized domains.\`);
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }`;

const newGoogleCatch = `      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.\`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }`;

if (content.includes(targetGoogleCatch)) {
    content = content.replace(targetGoogleCatch, newGoogleCatch);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated Google Auth error handling.");
} else {
    console.log("Could not find Google Catch block.");
}
