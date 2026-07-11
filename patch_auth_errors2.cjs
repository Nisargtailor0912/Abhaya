const fs = require('fs');
let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

content = content.replace(
  "    } catch (err: any) {\n      console.error(err);\n      if (err.code === 'auth/unauthorized-domain')",
  "    } catch (err: any) {\n      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {\n        console.error(err);\n      }\n      if (err.code === 'auth/unauthorized-domain')"
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Auth.tsx error logging patched for the second instance');
