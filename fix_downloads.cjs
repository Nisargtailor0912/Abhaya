const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const downloadsSection = `
                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">App Updates & Downloads</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                      <span className="text-xl">📱</span> Android / Windows
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Download the latest Abhaya APK or install as an app on Windows for instant access.</p>
                    <div className="flex gap-2">
                      <a 
                        href="/Abhaya-App-1.0.apk" 
                        download
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Downloading latest Abhaya App Update...");
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download size={16} /> Download APK
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                      <span className="text-xl">🔄</span> Important Updates
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Version 1.0.3 (Latest)</p>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc ml-4 space-y-1">
                      <li>Added Stealth Mode capabilities</li>
                      <li>Enhanced Safe Route navigation on Maps</li>
                      <li>Improved battery optimization for tracking</li>
                    </ul>
                  </div>
                </div>`;

if (!app.includes('App Updates & Downloads')) {
  app = app.replace(
    /<hr className="border-slate-100 dark:-border-slate-700"\s*\/>\s*<div className="space-y-4">\s*<div className="flex items-center justify-between">/m,
    downloadsSection + '\n                <hr className="border-slate-100 dark:border-slate-700" />\n                <div className="space-y-4">\n                  <div className="flex items-center justify-between">'
  );
  fs.writeFileSync('src/App.tsx', app);
}
