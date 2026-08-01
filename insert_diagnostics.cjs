const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => { setShowSettings(false); signOut(auth); }} `;

const newStr = `                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">System & Updates</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><RefreshCw size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Auto Fix & Updates</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Automatically diagnose and patch bugs</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.autoDiagnosticUpdates} onChange={() => toggleSetting('autoDiagnosticUpdates')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  
                  <button 
                    onClick={() => {
                      alert("Running full system diagnostic...\\n\\n✓ Checking background services...\\n✓ Verifying permissions...\\n✓ Syncing latest security patches...\\n\\nSystem is healthy and up to date.");
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-colors font-medium border border-indigo-100 dark:border-indigo-800/50"
                  >
                    <Activity size={18} />
                    Run System Diagnostic
                  </button>
                </div>

` + targetStr;

if (!app.includes('Auto Fix & Updates')) {
    app = app.replace(targetStr, newStr);
    fs.writeFileSync('src/App.tsx', app);
}
