const fs = require('fs');
const file = 'src/firebase.ts';
let content = fs.readFileSync(file, 'utf8');

const targetImport = 'import { getAuth, GoogleAuthProvider } from "firebase/auth";';
const newImport = 'import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";';

const targetExport = 'export const googleProvider = new GoogleAuthProvider();';
const newExport = 'export const googleProvider = new GoogleAuthProvider();\nexport const appleProvider = new OAuthProvider("apple.com");';

if (content.includes(targetImport)) {
  content = content.replace(targetImport, newImport);
}

if (content.includes(targetExport)) {
  content = content.replace(targetExport, newExport);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Added Apple Provider to firebase.ts');
