const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /alert\(`EMERGENCY ALERTS DISPATCHED!.*?Admin Portal\.`\);/s,
  "alert(`EMERGENCY SOS ACTIVATED!\\n\\n1. Request sent to Admin Portal.\\n2. Notifying Trusted Contacts (${contactNames}) with a high-priority alert ringtone call.\\n3. SMS messages dispatched with your live location link.\\n\\nStay calm. Help is on the way.`);"
);

fs.writeFileSync('src/App.tsx', content);
console.log('SOS alert patched');
