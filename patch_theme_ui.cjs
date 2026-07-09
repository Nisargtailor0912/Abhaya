const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              <div className="overflow-y-auto p-5 space-y-6">
                
                <div className="space-y-4">`;

const newStr = `              <div className="overflow-y-auto p-5 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Appearance</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => { const s = {...settings, theme: 'light'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={\`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors \${settings.theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}\`}
                    >
                      <Sun size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Light</span>
                    </button>
                    <button 
                      onClick={() => { const s = {...settings, theme: 'dark'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={\`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors \${settings.theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}\`}
                    >
                      <Moon size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Dark</span>
                    </button>
                    <button 
                      onClick={() => { const s = {...settings, theme: 'system'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={\`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors \${settings.theme === 'system' || !settings.theme ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}\`}
                    >
                      <Settings size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">System</span>
                    </button>
                  </div>
                </div>
                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="space-y-4">`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched');
} else {
  console.log('not found');
}
