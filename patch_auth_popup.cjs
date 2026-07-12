const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// Replace the Google error handler
content = content.replace(
  `} else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');`,
  `} else if (err.code === 'auth/popup-closed-by-user') {
        if (window.self !== window.top) {
          setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ "Open in new tab" button at the top right of the preview to sign in.');
        } else {
          setError('Sign-in popup was closed before completion. Please try again.');
        }`
);

// Replace the Apple error handler
content = content.replace(
  `} else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');`,
  `} else if (err.code === 'auth/popup-closed-by-user') {
        if (window.self !== window.top) {
          setError('Apple Sign-In popup was blocked by your browser. Please click the ↗️ "Open in new tab" button at the top right of the preview to sign in.');
        } else {
          setError('Sign-in popup was closed before completion. Please try again.');
        }`
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Patched Auth.tsx');
