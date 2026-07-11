const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// For <button> tags with hover classes, add hover:shadow-glow-dark or hover:shadow-glow
// Also for SOS button, it already has shadow-rose-600/40 etc. Let's make it glow more on hover: hover:shadow-[0_0_30px_rgba(244,63,94,0.8)]
// Let's just do a simpler search and replace for specific button classes.
content = content.replace(
  /hover:bg-slate-100 dark:bg-slate-700/g,
  'hover:bg-slate-100 dark:bg-slate-700 hover:shadow-glow dark:hover:shadow-glow-dark'
);

content = content.replace(
  /hover:bg-slate-200 dark:bg-slate-600/g,
  'hover:bg-slate-200 dark:bg-slate-600 hover:shadow-glow dark:hover:shadow-glow-dark'
);

content = content.replace(
  /hover:bg-white\/50/g,
  'hover:bg-white/50 hover:shadow-glow dark:hover:shadow-glow-dark'
);

// SOS button
content = content.replace(
  /className=\{`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-colors duration-300 \$\{/g,
  'className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all duration-300 ${'
);

// Floating Action Button for Bot
content = content.replace(
  /hover:bg-indigo-700 hover:scale-105 transition-all z-\[40\]/g,
  'hover:bg-indigo-700 hover:scale-105 hover:shadow-glow transition-all z-[40]'
);

// Cards (features)
// They are: className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10
content = content.replace(
  /className="bg-white\/40 dark:bg-slate-900\/40 backdrop-blur-2xl rounded-3xl p-5 shadow-\[0_8px_32px_rgba\(0,0,0,0.05\)\] border border-white\/40 dark:border-white\/10/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-300'
);

content = content.replace(
  /className="bg-white\/40 dark:bg-slate-900\/40 backdrop-blur-2xl rounded-3xl p-6 shadow-\[0_8px_32px_rgba\(0,0,0,0.05\)\] border border-white\/40 dark:border-white\/10/g,
  'className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-300'
);

// Quick Actions Buttons
content = content.replace(
  /className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white\/30 dark:bg-slate-800\/30 backdrop-blur-md border border-white\/40 dark:border-white\/10 hover:bg-white\/50/g,
  'className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/50 hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-300'
);

// Emergency Contacts cards
content = content.replace(
  /className="flex items-center justify-between p-4 rounded-2xl border transition-all \$\{/g,
  'className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-glow dark:hover:shadow-glow-dark ${'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched with glows');
