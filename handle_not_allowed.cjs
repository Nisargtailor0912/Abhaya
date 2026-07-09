const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetApple = `      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else {
        setError(err.message || 'An error occurred during Apple authentication.');
      }`;
      
const replaceApple = `      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Apple Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during Apple authentication.');
      }`;

content = content.replace(targetApple, replaceApple);

const targetGoogle = `      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }`;

const replaceGoogle = `      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }`;

content = content.replace(targetGoogle, replaceGoogle);

fs.writeFileSync(file, content, 'utf8');
