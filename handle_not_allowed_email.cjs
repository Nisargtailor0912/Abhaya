const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetEmail = `    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }`;

const replaceEmail = `    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }`;

content = content.replace(targetEmail, replaceEmail);
fs.writeFileSync(file, content, 'utf8');
