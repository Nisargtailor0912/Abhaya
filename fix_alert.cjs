const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    // Removed blocking alert to allow intents to fire.`;

const replacement = `    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    // Use setTimeout so the alert doesn't block the intents from opening on mobile
    setTimeout(() => {
      alert(\`EMERGENCY SOS ACTIVATED!\\n\\n1. Request sent to Admin Portal.\\n2. Notifying Trusted Contacts (\${contactNames}) with a high-priority alert ringtone call.\\n3. SMS messages dispatched with your live location link.\\n\\nStay calm. Help is on the way.\`);
    }, 1500);`;

app = app.replace(target, replacement);
fs.writeFileSync('src/App.tsx', app);
