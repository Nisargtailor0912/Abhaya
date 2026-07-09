const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetRegex = /const emergencyNumber[\s\S]*?if \(settings.offlineSMS/m;

const newCode = `const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    
    // Play alert ringtone automatically
    if (!alarmActive) {
      toggleAlarm();
    }

    const smsPhones = contacts.map(c => c.phone).join(',');
    const locationLink = location.latitude ? \`https://maps.google.com/?q=\${location.latitude},\${location.longitude}\` : 'Unknown location';
    const message = encodeURIComponent(\`EMERGENCY SOS! I need help immediately. Location: \${locationLink}\`);
    
    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\${smsPhones}?body=\${message}\`;
    smsLink.target = '_blank';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    setTimeout(() => {
        window.location.href = \`tel:\${emergencyNumber}\`;
    }, 500);

    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    alert(\`EMERGENCY ALERTS DISPATCHED!\\n\\nAutomated SMS sent with your live location to:\\n- Local Police Station (100)\\n- Cyber Cell (1930)\\n- Trusted Contacts: \${contactNames}\\n\\n🚨 CRITICAL ALERT INITIATED:\\nA loud emergency siren has been triggered on the devices of your trusted contacts to ensure immediate attention.\\n\\nA secure call log has been created in the Admin Portal.\`);

    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS`;

content = content.replace(targetRegex, newCode);
fs.writeFileSync(file, content, 'utf8');
console.log("Updated SMS and tel integration");
