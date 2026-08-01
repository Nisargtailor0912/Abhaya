const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const permBtnCode = `
        {/* Download & Permissions Settings */}
        <section className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 mt-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert size={20} /> Safety Protections & App Download
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Install Abhaya as a standalone app or secure your permissions. Lock screen widgets are available on Android when installed via the button below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={async () => {
                   try {
                     await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                     navigator.geolocation.getCurrentPosition(()=>{}, ()=>{});
                     if (Notification.permission !== 'granted') {
                       Notification.requestPermission();
                     }
                     alert("Permissions requested successfully. Ensure they are allowed in your browser settings.");
                   } catch (e) {
                     alert("Failed to grab some permissions. Please check your browser settings.");
                   }
                }}
                className="w-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl py-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <ShieldAlert size={18} /> Enable Protections (Permissions)
              </button>

              <button
                onClick={() => {
                  alert("To install as an app (APK/PWA):\n\nAndroid/Chrome: Tap 'Add to Home Screen' or 'Install' in your browser menu.\niOS/Safari: Tap 'Share' -> 'Add to Home Screen'.\n\nOnce installed, you can access the app directly from your home screen.");
                }}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl py-3 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Abhaya App
              </button>
            </div>
          </div>
        </section>
`;

const anchor = '{/* Safety Tips */}';

if (!app.includes('Enable Protections (Permissions)')) {
    app = app.replace(anchor, permBtnCode + '\\n\\n        ' + anchor);
    fs.writeFileSync('src/App.tsx', app);
}
