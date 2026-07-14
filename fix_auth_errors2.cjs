const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// Replace both with placeholders first
content = content.replace("setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');", "setError('__APPLE_TEMP__');");
content = content.replace("setError('Apple Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');", "setError('__GOOGLE_TEMP__');");

// Now substitute back
content = content.replace("setError('__APPLE_TEMP__');", "setError('Apple Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');");
content = content.replace("setError('__GOOGLE_TEMP__');", "setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');");

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Fixed properly');
