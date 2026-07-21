const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change handleSOSClick to activate immediately
const oldHandleSOSClick = `    } else {
      setCountdown(3);
    }`;

const newHandleSOSClick = `    } else {
      activateSOS();
    }`;
app = app.replace(oldHandleSOSClick, newHandleSOSClick);

// 2. Update activateSOS to fix sms/tel
const targetActivate = `    const smsLink = document.createElement('a');
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

const newActivate = `    // Use hidden iframe for SMS to avoid blocking tel intent
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = \`sms:\${smsPhones}?body=\${message}\`;
    document.body.appendChild(iframe);
    
    // Slight delay to allow SMS intent to fire before tel intent
    setTimeout(() => {
        window.location.href = \`tel:\${emergencyNumber}\`;
    }, 300);

    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    // Removed blocking alert to allow intents to fire. Show a non-blocking toast or rely on UI updates.
    // The UI already shows "Active" state.`;

app = app.replace(targetActivate, newActivate);

fs.writeFileSync('src/App.tsx', app);
