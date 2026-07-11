const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Some other common utility containers in App.tsx:
// "bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700" 
// (If any were missed)
content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10'
);

content = content.replace(
  /className="fixed inset-0 bg-slate-900\/50 backdrop-blur-sm z-50 flex items-center justify-center"/g,
  'className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"'
);

// Buttons on modals that are solid bg-white/slate-100
content = content.replace(
  /className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-3/g,
  'className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-3 border border-white/20 dark:border-white/5'
);

// Buttons on cards (Quick Actions)
content = content.replace(
  /className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-700\/50 hover:bg-slate-100/g,
  'className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/50'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched part 2');
