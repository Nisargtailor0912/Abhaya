const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldWindows = `<div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    💻 Windows Desktop
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Install as a PWA on your Windows PC.</p>
                </div>
                <button 
                  onClick={() => alert("To install on Windows, click the install icon in your browser's address bar.")}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Download size={18} /> Install App
                </button>
              </div>`;

const newWindows = `<div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    💻 Windows Desktop
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Windows PCs. <br/><span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span><br/><span className="text-[10px] text-slate-400">(Supports Windows 10 & 11)</span></p>
                </div>
                <a 
                  href="/Abhaya-Secure-App-Setup.exe" 
                  download="Abhaya-Secure-App-Setup.exe"
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Download size={18} /> Download Desktop App
                </a>
              </div>`;

app = app.replace(oldWindows, newWindows);
fs.writeFileSync('src/App.tsx', app);
