const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\${smsPhones}?body=\${message}\`;
    smsLink.target = '_top';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    setTimeout(() => {
        const telLink = document.createElement('a');
        telLink.href = \`tel:\${emergencyNumber}\`;
        telLink.target = '_top';
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
    }, 500);

    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    alert(\`EMERGENCY SOS ACTIVATED!\\n\\n1. Request sent to Admin Portal.\\n2. Notifying Trusted Contacts (\${contactNames}) with a high-priority alert ringtone call.\\n3. SMS messages dispatched with your live location link.\\n\\nStay calm. Help is on the way.\`);`;

if (app.includes(target)) {
    console.log("Target found!");
} else {
    console.log("Target not found!");
}
