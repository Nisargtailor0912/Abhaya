const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    📱 Android APK (Secure)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Android devices. <br/><span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span><br/><span className="text-[10px] text-slate-400">(Note: Your browser may ask to confirm downloading an APK. Choose "Keep" to download.)</span></p>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Windows PCs. <br/><span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span><br/><span className="text-[10px] text-slate-400">(Supports Windows 10 & 11)</span></p>
                </div>
                <a 
                  href="/Abhaya-Secure-App-Setup.exe" 
                  download="Abhaya-Secure-App-Setup.exe"
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Download size={18} /> Download Desktop App
                </a>
              </div>
            </div>`;

const replaceStr = `            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    📱 Secure Android App & Widget
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Install to get a persistent Lock Screen Widget for instant SOS triggering and safe routing.<br/>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span><br/>
                    <span className="text-[10px] text-slate-400">(To install, tap 'Share' or browser menu, then 'Add to Home screen'. An APK wrapper can be used via tools like PWABuilder.)</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    alert("To install as an app (APK/PWA) and enable the Lock Screen Widget:\\n\\nAndroid/Chrome: Tap 'Add to Home Screen' or 'Install' in your browser menu.\\niOS/Safari: Tap 'Share' -> 'Add to Home Screen'.\\n\\nOnce installed, you can access the SOS widget directly from your lock screen.");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Download size={18} /> Download Secure App
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                    🛡️ Activate Protections
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Grant necessary permissions for Location (live tracking), Camera/Mic (evidence recording), and Notifications (alerts).<br/>
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
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <ShieldAlert size={18} /> Enable Protections
                </button>
              </div>
            </div>`;

if (app.includes('💻 Windows Desktop')) {
    app = app.replace(targetStr, replaceStr);
    fs.writeFileSync('src/App.tsx', app);
}
