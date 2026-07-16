const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the header button
const oldHeader = `<button onClick={() => setShowDownloads(true)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
              <Download size={20} />
            </button>`;
app = app.replace(oldHeader, '');

// 2. Remove the modal
const startModal = '{showDownloads && (';
if (app.includes(startModal)) {
    const startIndex = app.indexOf(startModal);
    // Find the end of this modal by counting brackets or just using regex up to 
    // \n        )}
    const endModalStr = '        )}\n';
    const endIndex = app.indexOf(endModalStr, startIndex) + endModalStr.length;
    app = app.substring(0, startIndex) + app.substring(endIndex);
}

// 3. Add the download section above footer
const downloadSection = `
        {/* App Downloads Section */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Download size={24} className="text-indigo-600 dark:text-indigo-400" />
              Download Abhaya App
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Get the secure Abhaya application for your Android or Windows device. Version 1.0.3 includes enhanced Stealth Mode, safe routing, and better battery tracking.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    📱 Android APK (Secure)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Android devices.</p>
                </div>
                <a 
                  href="/Abhaya-Secure-App.apk" 
                  download="Abhaya-Secure-App.apk"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Download size={18} /> Download APK
                </a>
              </div>

              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
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
              </div>
            </div>
          </div>
        </section>
`;

app = app.replace('      </main>\n\n      <footer', downloadSection + '\n      </main>\n\n      <footer');

fs.writeFileSync('src/App.tsx', app);
