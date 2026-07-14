const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '                    className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${\n                      isActive \n                        ? \'border-orange-500 bg-orange-50 shadow-[0_8px_16px_rgba(249,115,22,0.2)] scale-105\' \n                        : \'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105\'\n                    }`}',
  '                    className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${\n                      isActive \n                        ? \'border-orange-500 bg-orange-50\' \n                        : \'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 hover:shadow-sm\'\n                    }`}'
);

fs.writeFileSync('src/App.tsx', content);
