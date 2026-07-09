const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// add battery states
const targetStates = `  const [countdown, setCountdown] = useState<number | null>(null);`;
const newStates = `  const [countdown, setCountdown] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);`;
content = content.replace(targetStates, newStates);

// add useEffect
const targetEffect = `  const oscillatorRef = useRef<OscillatorNode | null>(null);`;
const newEffect = `  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    let batteryManager: any = null;
    let updateBatteryStatus: () => void;

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryManager = battery;
        
        updateBatteryStatus = () => {
          const level = Math.round(battery.level * 100);
          setBatteryLevel(level);
          setIsCharging(battery.charging);
          
          setSettings(prev => {
            if (level <= 15 && !battery.charging && !prev.lowPowerMode) {
              const newSettings = { ...prev, lowPowerMode: true };
              saveUserData({ settings: newSettings });
              setTimeout(() => {
                alert("Battery level is critically low (≤15%). Low Power Mode activated automatically to preserve battery.");
              }, 500);
              return newSettings;
            }
            return prev;
          });
        };

        updateBatteryStatus();
        
        batteryManager.addEventListener('levelchange', updateBatteryStatus);
        batteryManager.addEventListener('chargingchange', updateBatteryStatus);
      }).catch((e: any) => console.log('Battery API not supported/allowed', e));
    }

    return () => {
       if (batteryManager && updateBatteryStatus) {
          batteryManager.removeEventListener('levelchange', updateBatteryStatus);
          batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
       }
    };
  }, []);`;
content = content.replace(targetEffect, newEffect);

// modify header to show battery
const targetHeader = `<div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">`;
const newHeader = `<div className="flex items-center gap-2">
            {batteryLevel !== null && (
              <div className={\`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full \${batteryLevel <= 15 && !isCharging ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}\`}>
                <Battery size={16} className={isCharging ? "animate-pulse" : ""} />
                <span>{batteryLevel}%</span>
                {isCharging && <span className="text-[10px] ml-0.5">⚡</span>}
              </div>
            )}
            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">`;
content = content.replace(targetHeader, newHeader);

fs.writeFileSync(file, content, 'utf8');
console.log('Added battery indicator');
