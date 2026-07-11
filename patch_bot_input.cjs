const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

content = content.replace(
  /className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:bg-slate-800 transition-colors resize-none max-h-32 min-h-\[48px\]"/g,
  'className="w-full text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors resize-none max-h-32 min-h-[48px]"'
);

fs.writeFileSync('src/components/SafetyBot.tsx', content);
console.log('SafetyBot.tsx textarea color patched');
