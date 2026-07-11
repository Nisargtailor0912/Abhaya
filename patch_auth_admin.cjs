const fs = require('fs');
let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const targetStr = `        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
          onAuth();
          return;
        } catch (signInErr: any) {
          setError(signInErr.message || 'Error signing in to admin account. Please ensure the admin account exists in Firebase Console.');
          setLoading(false);
          return;
        }`;

const newStr = `        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
          onAuth();
          return;
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/user-not-found') {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
              await updateProfile(userCredential.user, { displayName: 'Admin' });
              onAuth();
              return;
            } catch (createErr: any) {
              setError(createErr.message || 'Error creating admin account.');
              setLoading(false);
              return;
            }
          }
          setError(signInErr.message || 'Error signing in to admin account. Please ensure the admin account exists in Firebase Console.');
          setLoading(false);
          return;
        }`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/components/Auth.tsx', content);
  console.log('patched');
} else {
  console.log('not found');
}
