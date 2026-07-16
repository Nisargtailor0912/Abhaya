const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
              <Settings size={20} />
            </button>`;
const newHeader = `            <button onClick={() => setShowDownloads(true)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
              <Download size={20} />
            </button>
            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
              <Settings size={20} />
            </button>`;

if (app.includes(oldHeader) && !app.includes('setShowDownloads(true)')) {
    app = app.replace(oldHeader, newHeader);
    fs.writeFileSync('src/App.tsx', app);
}
