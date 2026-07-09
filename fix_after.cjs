const fs = require('fs');

const files = ['src/App.tsx', 'src/components/AdminPortal.tsx', 'src/components/SafetyBot.tsx', 'src/components/Auth.tsx'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/after:bg-white dark:bg-slate-800/g, 'after:bg-white dark:after:bg-slate-800');
    fs.writeFileSync(file, content);
  }
}
console.log('done');
