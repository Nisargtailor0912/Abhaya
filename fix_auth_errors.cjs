const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// The error messages for popup blocked are swapped for Apple and Google
content = content.replace(
  "setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');",
  "setError('Apple Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');"
);

content = content.replace(
  "setError('Apple Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');",
  "setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ \"Open in new tab\" button at the top right of the preview to sign in.');"
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Fixed auth errors');
