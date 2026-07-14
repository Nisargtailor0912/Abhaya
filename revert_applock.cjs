const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import AppLock
content = content.replace("import AppLock from './components/AppLock';\n", "");

// Remove second Lock import
content = content.replace("  EyeOff,\n  Lock\n} from 'lucide-react';", "  EyeOff\n} from 'lucide-react';");

// Remove state
content = content.replace("  const [isUnlocked, setIsUnlocked] = useState(false);\n", "");

// Remove render block
content = content.replace("  if (settings.requireBiometrics && !isUnlocked) {\n    return <AppLock onUnlock={() => setIsUnlocked(true)} />;\n  }\n\n", "");
content = content.replace("  if (settings.requireBiometrics && !isUnlocked) {\n    return <AppLock onUnlock={() => setIsUnlocked(true)} />;\n  }", "");

// Remove settings block
content = content.replace(`
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center"><Lock size={20} /></div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">App Lock</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Require biometrics on open</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings.requireBiometrics || false} onChange={() => toggleSetting('requireBiometrics')} />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>`, "");

fs.writeFileSync('src/App.tsx', content);

