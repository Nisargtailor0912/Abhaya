const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');

content = content.replace(
  'import { getFirestore } from "firebase/firestore";',
  'import { getFirestore, initializeFirestore } from "firebase/firestore";'
);

content = content.replace(
  'export const db = getFirestore(app);',
  'export const db = initializeFirestore(app, { experimentalForceLongPolling: true });'
);

fs.writeFileSync('src/firebase.ts', content);
console.log('firebase.ts patched with long polling');
