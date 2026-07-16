const fs = require('fs');
let app = fs.readFileSync('src/components/Auth.tsx', 'utf8');

app = app.replace(
    'await signInWithPopup(auth, googleProvider);\n      onAuth();',
    'await signInWithPopup(auth, googleProvider);'
);

app = app.replace(
    'import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signInWithPopup } from \'firebase/auth\';',
    'import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signInWithPopup, signInWithRedirect } from \'firebase/auth\';'
);

// We can add a fallback to signInWithRedirect if popup fails with certain errors
const oldGoogleSign = `      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.\`);
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {
        if (window.self !== window.top) {
          setError('Google Sign-In popup was blocked by your browser. Please click the ↗️ "Open in new tab" button at the top right of the preview to sign in.');
        } else {
          setError('Sign-in popup was closed before completion. Please try again.');
        }
      } else if (err.code === 'auth/operation-not-allowed') {`;

const newGoogleSign = `      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.\`);
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {
        if (window.self !== window.top) {
          setError('Google Sign-In popup was blocked. Try opening in a new tab, or use guest mode.');
        } else {
          try {
             // Fallback to redirect if popup fails
             await signInWithRedirect(auth, googleProvider);
          } catch(redirectErr) {
             setError('Sign-in popup was closed or blocked. Please try again or use guest mode.');
          }
        }
      } else if (err.code === 'auth/operation-not-allowed') {`;

app = app.replace(oldGoogleSign, newGoogleSign);
fs.writeFileSync('src/components/Auth.tsx', app);
