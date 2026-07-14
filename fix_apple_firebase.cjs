const fs = require('fs');

let content = fs.readFileSync('src/firebase.ts', 'utf8');

content = content.replace(
  'import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";',
  'import { getAuth, GoogleAuthProvider } from "firebase/auth";'
);
content = content.replace(
  'export const appleProvider = new OAuthProvider("apple.com");\nappleProvider.addScope(\'email\');\nappleProvider.addScope(\'name\');\n',
  ''
);
// just in case
content = content.replace(
  'export const appleProvider = new OAuthProvider("apple.com");',
  ''
);
content = content.replace(
  "appleProvider.addScope('email');\nappleProvider.addScope('name');\n",
  ""
);

fs.writeFileSync('src/firebase.ts', content);
