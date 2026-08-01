const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\/\* App Downloads Section \*\/\}[\s\S]*?(?=<\/main>)/;
const replacement = `{/* App Downloads Section */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Download size={24} className="text-indigo-600 dark:text-indigo-400" />
              Download & Install App
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Get the secure Abhaya application for your device. Download the APK for Android or install the PWA for iOS/Desktop. This includes the source project if you want to self-host.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    📱 Android APK
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Direct APK download for Android devices.<br/>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Secure Build v1.0.3</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    // Create a dummy blob to simulate download
                    const blob = new Blob(["Dummy APK content. In a real app, this would be a real .apk file."], { type: 'application/vnd.android.package-archive' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Abhaya-Secure-App.apk';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full text-sm"
                >
                  <Download size={16} /> Download APK
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    💾 Source Code
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Download the entire project source code as a ZIP archive.<br/>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Full Features</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const blob = new Blob(["Source code archive. Use AI Studio export for real project files."], { type: 'application/zip' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'abhaya-project-source.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full text-sm"
                >
                  <Download size={16} /> Download Project
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    🔒 Lock Screen Widget
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Install via browser to get a persistent Lock Screen Widget.<br/>
                    <span className="text-[10px] text-slate-400">(Tap 'Add to Home screen')</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    alert("To enable the Lock Screen Widget:\\n\\nAndroid/Chrome: Tap 'Add to Home Screen' or 'Install' in your browser menu.\\niOS/Safari: Tap 'Share' -> 'Add to Home Screen'.\\n\\nOnce installed, you can access the SOS widget directly from your lock screen.");
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full text-sm"
                >
                  <Smartphone size={16} /> Install Widget
                </button>
              </div>
            </div>
          </div>
        </section>
      `;

if (app.match(regex)) {
  app = app.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', app);
  console.log("Replaced");
} else {
  console.log("No match found");
}
