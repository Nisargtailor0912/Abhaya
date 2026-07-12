const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

content = content.replace(
  "import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signInAnonymously, sendEmailVerification } from 'firebase/auth';",
  "import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signInAnonymously } from 'firebase/auth';"
);

content = content.replace(
  `        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await updateProfile(userCredential.user, { displayName: fullName });
        await sendEmailVerification(userCredential.user);
        onAuth();`,
  `        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await updateProfile(userCredential.user, { displayName: fullName });
        onAuth();`
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Auth.tsx restored.');
