const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\$\{smsPhones\}?body=\$\{message\}\`;
    smsLink.target = '_blank';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    setTimeout(() => {
        window.location.href = \`tel:\$\{emergencyNumber\}\`;
    }, 500);`;

const newCode = `    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\$\{smsPhones\}?body=\$\{message\}\`;
    smsLink.target = '_top';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    setTimeout(() => {
        const telLink = document.createElement('a');
        telLink.href = \`tel:\$\{emergencyNumber\}\`;
        telLink.target = '_top';
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
    }, 500);`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('src/App.tsx', content);
  console.log('sms and tel links patched successfully');
} else {
  console.log('could not find exact code to replace');
}
