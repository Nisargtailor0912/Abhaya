const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative z-0 overflow-x-hidden">',
  '<div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative z-0">'
);

content = content.replace(
  '      {/* Glassmorphism background blobs */}\n      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">\n        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-rose-400/20 dark:bg-rose-500/10 blur-[100px] animate-pulse-slow"></div>\n        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[120px] animate-pulse-slow"></div>\n        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px] animate-pulse-slow"></div>\n      </div>',
  ''
);

content = content.replace(
  '<header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">',
  '<header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">'
);

content = content.replace(
  '<div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 transition-all duration-300 flex flex-col gap-3">',
  '<div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col gap-3">'
);

fs.writeFileSync('src/App.tsx', content);

let authContent = fs.readFileSync('src/components/Auth.tsx', 'utf8');

authContent = authContent.replace(
  '<div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">',
  '<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative">'
);

authContent = authContent.replace(
  '        <div className="absolute inset-0 bg-[url(\'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop\')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>',
  ''
);

authContent = authContent.replace(
  '      <div className="absolute inset-0 overflow-hidden pointer-events-none">\n        <motion.div \n          animate={{\n            x: [0, -150, 100, 0],\n            y: [0, 150, -100, 0],\n            scale: [1, 0.8, 1.2, 1]\n          }}\n          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}\n          className="absolute top-40 -right-20 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen"\n         />\n        <motion.div \n          animate={{ \n            x: [0, 100, -150, 0],\n            y: [0, -100, 150, 0],\n            scale: [1, 1.5, 0.9, 1]\n          }}\n          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}\n          className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen"\n         />\n      </div>',
  ''
);

authContent = authContent.replace(
  '<div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">',
  '<div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 relative w-full">'
);

authContent = authContent.replace(
  /<h2 className="text-3xl font-light text-white mb-2">/g,
  '<h2 className="text-3xl font-medium text-slate-900 dark:text-white mb-2">'
);
authContent = authContent.replace(
  /<p className="text-indigo-200 text-sm">/g,
  '<p className="text-slate-500 dark:text-slate-400 text-sm">'
);
authContent = authContent.replace(
  /className="block text-sm font-medium text-indigo-100 mb-1\.5"/g,
  'className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"'
);
authContent = authContent.replace(
  /className="w-full bg-white\/5 border border-white\/10 rounded-xl px-4 py-3 text-white placeholder-indigo-200\/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"/g,
  'className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"'
);
authContent = authContent.replace(
  /className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-3 font-medium transition-all shadow-\[0_0_20px_rgba\(79,70,229,0\.4\)\] hover:shadow-\[0_0_30px_rgba\(79,70,229,0\.6\)\]"/g,
  'className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-medium transition-all"'
);
authContent = authContent.replace(
  /className="w-full bg-white\/5 hover:bg-white\/10 text-white rounded-xl px-4 py-3 font-medium border border-white\/10 transition-all flex items-center justify-center gap-2"/g,
  'className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-medium border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"'
);

fs.writeFileSync('src/components/Auth.tsx', authContent);

let slideSosContent = fs.readFileSync('src/components/SlideToSOS.tsx', 'utf8');
slideSosContent = slideSosContent.replace(
  /backdrop-blur-2xl/g,
  ''
);
slideSosContent = slideSosContent.replace(
  /shadow-\[0_8px_32px_rgba\(244,63,94,0\.15\)\]/g,
  'shadow-sm'
);
slideSosContent = slideSosContent.replace(
  /bg-rose-500\/20 dark:bg-rose-900\/30/g,
  'bg-rose-100 dark:bg-rose-900/50'
);
fs.writeFileSync('src/components/SlideToSOS.tsx', slideSosContent);

let slideAnswerContent = fs.readFileSync('src/components/SlideToAnswer.tsx', 'utf8');
slideAnswerContent = slideAnswerContent.replace(
  /backdrop-blur-2xl/g,
  ''
);
slideAnswerContent = slideAnswerContent.replace(
  /bg-white\/20 dark:bg-slate-800\/40/g,
  'bg-emerald-100 dark:bg-emerald-900/50'
);
slideAnswerContent = slideAnswerContent.replace(
  /border-white\/30 dark:border-white\/10/g,
  'border-emerald-200 dark:border-emerald-800'
);
fs.writeFileSync('src/components/SlideToAnswer.tsx', slideAnswerContent);

