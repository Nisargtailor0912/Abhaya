const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const downloadsModal = `
        {showDownloads && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">App Downloads & Updates</h3>
                <button onClick={() => setShowDownloads(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-5 space-y-6">
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
              </div>
            </motion.div>
          </motion.div>
        )}
`;

if (!app.includes('App Downloads & Updates')) {
    app = app.replace(
        '{showSettings && (',
        downloadsModal + '\n        {showSettings && ('
    );
    fs.writeFileSync('src/App.tsx', app);
}
