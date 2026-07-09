const fs = require('fs');

const files = ['src/App.tsx', 'src/components/AdminPortal.tsx', 'src/components/SafetyBot.tsx', 'src/components/Auth.tsx'];

const replacements = [
  { regex: /bg-white/g, replacement: 'bg-white dark:bg-slate-800' },
  { regex: /bg-slate-50/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /bg-slate-100/g, replacement: 'bg-slate-100 dark:bg-slate-700' },
  { regex: /bg-slate-200/g, replacement: 'bg-slate-200 dark:bg-slate-600' },
  { regex: /text-slate-900/g, replacement: 'text-slate-900 dark:text-white' },
  { regex: /text-slate-800/g, replacement: 'text-slate-800 dark:text-slate-100' },
  { regex: /text-slate-700/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { regex: /text-slate-600/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-500/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /border-slate-100/g, replacement: 'border-slate-100 dark:border-slate-700' },
  { regex: /border-slate-200/g, replacement: 'border-slate-200 dark:border-slate-600' }
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // First, let's clean up any previous dark mode classes we might have added by accident if run twice
    content = content.replace(/ dark:bg-slate-\d+/g, '');
    content = content.replace(/ dark:text-\w+(-\d+)?/g, '');
    content = content.replace(/ dark:border-slate-\d+/g, '');
    
    for (const r of replacements) {
      content = content.replace(r.regex, r.replacement);
    }
    fs.writeFileSync(file, content);
  }
}
console.log('done');
