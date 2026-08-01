const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">`;
const replaceStr = `      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Safety Overview Section */}
        <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            Safety Overview
          </h2>
          <div className="flex flex-wrap gap-2">
            {/* Network */}
            <div className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border \${isOnline ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'}\`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isOnline ? 'Network Online' : 'Network Offline'}
            </div>
            
            {/* Battery */}
            {batteryLevel !== null && (
              <div className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border \${batteryLevel > 20 || isCharging ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'}\`}>
                <Battery size={14} className={isCharging ? "animate-pulse" : ""} />
                {batteryLevel}% {isCharging ? 'Charging' : (batteryLevel > 20 ? 'Healthy' : 'Low')}
              </div>
            )}
            
            {/* Location */}
            <div className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border \${location.latitude ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : (location.error ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50')}\`}>
              <MapPin size={14} />
              {location.latitude ? 'Location Active' : (location.error ? 'Location Error' : 'Locating...')}
            </div>
            
            {/* Background Processes */}
            <div className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border \${!settings.lowPowerMode ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'}\`}>
              <Activity size={14} />
              {!settings.lowPowerMode ? 'Protections Active' : 'Low Power Mode'}
            </div>
          </div>
        </section>`;

if (!app.includes('Safety Overview Section')) {
  app = app.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', app);
}
