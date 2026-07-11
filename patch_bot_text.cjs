const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

content = content.replace(
  "msg.role === 'user' \n                      ? 'bg-indigo-100 text-indigo-900 rounded-tr-sm' \n                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'",
  "msg.role === 'user' \n                      ? 'bg-indigo-100 text-slate-900 dark:text-slate-100 rounded-tr-sm' \n                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-sm shadow-sm'"
);

fs.writeFileSync('src/components/SafetyBot.tsx', content);
console.log('SafetyBot.tsx text color patched');
