const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldApkText = '<p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Android devices.</p>';
const newApkText = '<p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Direct download for Android devices. <br/><span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified Secure Build</span><br/><span className="text-[10px] text-slate-400">(Note: Your browser may ask to confirm downloading an APK. Choose "Keep" to download.)</span></p>';

app = app.replace(oldApkText, newApkText);
fs.writeFileSync('src/App.tsx', app);
