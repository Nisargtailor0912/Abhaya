const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add isOnline state
if (!content.includes('const [isOnline')) {
  content = content.replace(
    'const [sosActive, setSosActive] = useState(false);',
    "const [sosActive, setSosActive] = useState(false);\n  const [isOnline, setIsOnline] = useState(navigator.onLine);"
  );
}

// Add event listeners for network
if (!content.includes('window.addEventListener("online"')) {
  const useEffectHooks = `  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);\n\n`;
  content = content.replace('  useEffect(() => {\n    const unsubscribe = onAuthStateChanged', useEffectHooks + '  useEffect(() => {\n    const unsubscribe = onAuthStateChanged');
}

// Add the banner above main
if (!content.includes('!isOnline && (')) {
  const banner = `
      {!isOnline && (
        <div className="bg-rose-500 text-white text-xs font-medium px-4 py-2 text-center flex items-center justify-center gap-2 z-30 relative">
          <WifiOff size={14} />
          You are currently offline. Some features may be unavailable.
        </div>
      )}
      <main`;
  content = content.replace('<main', banner);
}

// Add WifiOff to imports from lucide-react
if (!content.includes('WifiOff')) {
  content = content.replace('X,', 'X, WifiOff,');
}

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx network status patched');
