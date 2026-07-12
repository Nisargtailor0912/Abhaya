const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace("import VerifyEmail from './components/VerifyEmail';\n", "");

const emailVerifiedBlock = `  if (!user.emailVerified && user?.email?.toLowerCase() !== 'abhaya@abhaya.com') {
    return <VerifyEmail user={user} />;
  }
`;
content = content.replace(emailVerifiedBlock, "");

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx restored.');
