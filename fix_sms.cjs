const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    // Use hidden iframe for SMS to avoid blocking tel intent
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = \`sms:\${smsPhones}?body=\${message}\`;
    document.body.appendChild(iframe);
    
    // Slight delay to allow SMS intent to fire before tel intent
    setTimeout(() => {
        window.location.href = \`tel:\${emergencyNumber}\`;
    }, 300);`;

const newStr = `    // Use anchor tags to trigger intents reliably on mobile
    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\${smsPhones}?body=\${message}\`;
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    // Delay to allow SMS intent to fire before tel intent
    setTimeout(() => {
        const telLink = document.createElement('a');
        telLink.href = \`tel:\${emergencyNumber}\`;
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
    }, 800);`;

if (app.includes(targetStr)) {
    app = app.replace(targetStr, newStr);
    fs.writeFileSync('src/App.tsx', app);
    console.log('Fixed successfully');
} else {
    console.log('Target string not found!');
}
