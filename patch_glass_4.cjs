const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

content = content.replace(
  '<div className="bg-white dark:bg-slate-900 w-full max-w-lg md:m-4 md:rounded-3xl shadow-xl overflow-hidden flex flex-col h-[100dvh] md:h-[85vh]">',
  '<div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl w-full max-w-lg md:m-4 md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border md:border-white/50 md:dark:border-white/10 overflow-hidden flex flex-col h-[100dvh] md:h-[85vh]">'
);

content = content.replace(
  '<div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">',
  '<div className="p-4 border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">'
);

content = content.replace(
  '<div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 shadow-sm">',
  '<div className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">'
);

fs.writeFileSync('src/components/SafetyBot.tsx', content);
console.log('SafetyBot.tsx patched for glassmorphism');
