const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

content = content.replace(
  "import { auth, googleProvider, appleProvider } from '../firebase';",
  "import { auth, googleProvider } from '../firebase';"
);

const appleHandlerRegex = /const handleAppleSignIn = async \(\) => \{[\s\S]*?\n  \};\n/g;
content = content.replace(appleHandlerRegex, '');

const appleButtonRegex = /<button \s*onClick=\{handleAppleSignIn\}[\s\S]*?<\/button>\n/g;
content = content.replace(appleButtonRegex, '');

fs.writeFileSync('src/components/Auth.tsx', content);
