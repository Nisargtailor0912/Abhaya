const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// App background
content = content.replace(
  '<div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white pb-20 md:pb-0">',
  '<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative overflow-hidden z-0">\n      {/* Glassmorphism background blobs */}\n      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">\n        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-rose-400/20 dark:bg-rose-500/10 blur-[100px]"></div>\n        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[120px]"></div>\n        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px]"></div>\n      </div>'
);

// Header
content = content.replace(
  '<header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20">',
  '<header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">'
);

// Cards
content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10'
);

content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10'
);

// Modals/Overlays
content = content.replace(
  /className="bg-white dark:bg-slate-900 w-full max-w-md m-4 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-\[90vh\]"/g,
  'className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl w-full max-w-md m-4 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"'
);

// Navigation bar (bottom)
content = content.replace(
  '<nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-20 pb-safe">',
  '<nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-white/40 dark:border-white/10 z-20 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched for glassmorphism');
