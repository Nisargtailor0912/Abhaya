const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// We need to import sendEmailVerification
if (!content.includes('sendEmailVerification')) {
  content = content.replace(
    /import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signInAnonymously } from 'firebase\/auth';/,
    `import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signInAnonymously, sendEmailVerification } from 'firebase/auth';`
  );
}

// Then in handleSubmit:
// const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
// await updateProfile(userCredential.user, { displayName: fullName });
// onAuth();

content = content.replace(
  `        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await updateProfile(userCredential.user, { displayName: fullName });
        onAuth();`,
  `        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await updateProfile(userCredential.user, { displayName: fullName });
        await sendEmailVerification(userCredential.user);
        onAuth();`
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Patched Auth.tsx for email verification');
