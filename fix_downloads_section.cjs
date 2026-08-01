const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = `<div className="grid sm:grid-cols-2 gap-4">`;
const endStr = `                  </button>
              </div>
            </div>`;

const startIndex = app.indexOf(startStr);
const endIndex = app.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replaceStr = `<div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    📱 Android APK
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Direct download for Android devices.<br/>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span>
                  </p>
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
                    🔒 Lock Screen Widget
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Install via browser to get a persistent Lock Screen Widget for instant SOS triggering.<br/>
                    <span className="text-[10px] text-slate-400">(Tap 'Share' or browser menu, then 'Add to Home screen' to enable widgets.)</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    alert("To enable the Lock Screen Widget:\\n\\nAndroid/Chrome: Tap 'Add to Home Screen' or 'Install' in your browser menu.\\niOS/Safari: Tap 'Share' -> 'Add to Home Screen'.\\n\\nOnce installed, you can access the SOS widget directly from your lock screen.");
                  }}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Smartphone size={18} /> Install Widget
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    🛡️ Activate Protections
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Grant necessary permissions for Location, Camera, Mic, and Notifications.<br/>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Essential for full safety</span>
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                      navigator.geolocation.getCurrentPosition(()=>{}, ()=>{});
                      if (Notification.permission !== 'granted') {
                        Notification.requestPermission();
                      }
                      alert("Permissions requested successfully. Ensure they are allowed in your browser settings to keep the shield active.");
                    } catch (e) {
                      alert("Failed to grab some permissions. Please check your browser settings or try in a new tab.");
                    }
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <ShieldAlert size={18} /> Enable Protections
                </button>
              </div>
            </div>`;
  app = app.substring(0, startIndex) + replaceStr + app.substring(endIndex);
  fs.writeFileSync('src/App.tsx', app);
}
