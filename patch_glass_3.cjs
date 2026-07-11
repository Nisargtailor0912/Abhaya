const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');

// App background
content = content.replace(
  '<div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 flex flex-col md:flex-row">',
  '<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 flex flex-col md:flex-row relative overflow-hidden z-0">\n      {/* Glassmorphism background blobs */}\n      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">\n        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px]"></div>\n        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[120px]"></div>\n      </div>'
);

// Sidebar/header
content = content.replace(
  '<aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">',
  '<aside className="w-full md:w-64 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">'
);

// Mobile top nav
content = content.replace(
  '<div className="h-16 flex items-center justify-between px-4 md:hidden border-b border-slate-200 dark:border-slate-700">',
  '<div className="h-16 flex items-center justify-between px-4 md:hidden border-b border-white/20 dark:border-white/10">'
);

// Desktop sidebar header
content = content.replace(
  '<div className="p-6 hidden md:block border-b border-slate-200 dark:border-slate-700">',
  '<div className="p-6 hidden md:block border-b border-white/20 dark:border-white/10">'
);

// Cards
content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10'
);

// Stat cards
content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10'
);

// Modals
content = content.replace(
  /className="bg-white dark:bg-slate-900 w-full max-w-lg m-4 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-\[90vh\]"/g,
  'className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl w-full max-w-lg m-4 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"'
);

fs.writeFileSync('src/components/AdminPortal.tsx', content);
console.log('AdminPortal.tsx patched for glassmorphism');
