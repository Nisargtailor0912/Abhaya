const fs = require('fs');
let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// add icons
content = content.replace("import { ShieldAlert } from 'lucide-react';", "import { ShieldAlert, Sun, Moon, Settings } from 'lucide-react';");

// update function signature
content = content.replace(
  "export default function Auth({ onAuth }: { onAuth: () => void }) {",
  "export default function Auth({ onAuth, theme, onThemeChange }: { onAuth: () => void, theme?: 'light' | 'dark' | 'system', onThemeChange?: (theme: 'light' | 'dark' | 'system') => void }) {"
);

// add theme toggle UI
const targetBg = `      {/* Dark Mode Aurora */}
      <div className="absolute inset-0 overflow-hidden hidden dark:block -z-10 pointer-events-none">`;

const themeToggleUi = `
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50 flex bg-white/30 dark:bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-white/20 dark:border-white/10">
        <button 
          onClick={() => onThemeChange?.('light')}
          className={\`p-2 rounded-full transition-colors \${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}
        >
          <Sun size={16} />
        </button>
        <button 
          onClick={() => onThemeChange?.('dark')}
          className={\`p-2 rounded-full transition-colors \${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}
        >
          <Moon size={16} />
        </button>
        <button 
          onClick={() => onThemeChange?.('system')}
          className={\`p-2 rounded-full transition-colors \${theme === 'system' || !theme ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Dark Mode Aurora */}
      <div className="absolute inset-0 overflow-hidden hidden dark:block -z-10 pointer-events-none">`;

content = content.replace(targetBg, themeToggleUi);

// make portal transparent
content = content.replace(
  'className="w-full max-w-md bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl overflow-hidden p-8 relative z-10"',
  'className="w-full max-w-md bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 relative z-10"'
);

// input fields transparent too
content = content.replace(/bg-white dark:bg-slate-800\/50/g, 'bg-white/40 dark:bg-slate-800/30');

// google / apple buttons
content = content.replace(
  /className="w-full bg-white dark:bg-slate-800\/50 backdrop-blur-sm border border-white\/50 text-slate-700 dark:text-slate-200 font-semibold rounded-xl py-3 mt-4 hover:bg-white dark:bg-slate-800\/70 transition-colors flex items-center justify-center gap-2"/g,
  'className="w-full bg-white/40 dark:bg-slate-800/30 backdrop-blur-sm border border-white/30 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold rounded-xl py-3 mt-4 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2"'
);
content = content.replace(
  /className="w-full bg-white dark:bg-slate-800\/50 backdrop-blur-sm border border-white\/50 text-slate-700 dark:text-slate-200 font-semibold rounded-xl py-3 mt-3 hover:bg-white dark:bg-slate-800\/70 transition-colors flex items-center justify-center gap-2"/g,
  'className="w-full bg-white/40 dark:bg-slate-800/30 backdrop-blur-sm border border-white/30 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold rounded-xl py-3 mt-3 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2"'
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('patched');
