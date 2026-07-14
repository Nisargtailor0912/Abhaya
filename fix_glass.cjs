const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, '');
fs.writeFileSync('src/App.tsx', app);

let auth = fs.readFileSync('src/components/Auth.tsx', 'utf8');
auth = auth.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, '');
fs.writeFileSync('src/components/Auth.tsx', auth);

let bot = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');
bot = bot.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, '');
fs.writeFileSync('src/components/SafetyBot.tsx', bot);
