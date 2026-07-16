const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('lastSyncedLocation')) {
    app = app.replace(
        'const [isOnline, setIsOnline] = useState(navigator.onLine);',
        `const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncedLocation, setLastSyncedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);`
    );
    
    app = app.replace(
        `updateDoc(doc(db, 'emergencies', currentEmergencyId), {
        'location.latitude': location.latitude,
        'location.longitude': location.longitude
      }).catch(err => console.error("Error updating emergency location:", err));`,
        `updateDoc(doc(db, 'emergencies', currentEmergencyId), {
        'location.latitude': location.latitude,
        'location.longitude': location.longitude
      })
      .then(() => {
        setLastSyncedLocation({ lat: location.latitude!, lng: location.longitude! });
        setLastSyncedTime(new Date());
      })
      .catch(err => console.error("Error updating emergency location:", err));`
    );

    app = app.replace(
        `setCurrentEmergencyId(emgRef.id);`,
        `setCurrentEmergencyId(emgRef.id);
        if (location.latitude && location.longitude) {
          setLastSyncedLocation({ lat: location.latitude, lng: location.longitude });
          setLastSyncedTime(new Date());
        }`
    );

    const offlineBannerOld = `<div className="bg-rose-500 text-white text-xs font-medium px-4 py-2 text-center flex items-center justify-center gap-2 z-30 relative">
          <WifiOff size={14} />
          You are currently offline. Some features may be unavailable.
        </div>`;

    const offlineBannerNew = `<div className="bg-rose-500 text-white text-xs font-medium px-4 py-3 text-center flex flex-col items-center justify-center gap-1 z-30 relative shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff size={14} />
            <span className="font-bold">You are currently offline.</span> Some features may be unavailable.
          </div>
          {lastSyncedLocation && lastSyncedTime && (
            <div className="text-[10px] bg-rose-600/50 px-3 py-1 rounded-full mt-1 flex items-center gap-1.5 border border-rose-400/30">
              <MapPin size={10} />
              Last Synced: {lastSyncedLocation.lat.toFixed(4)}, {lastSyncedLocation.lng.toFixed(4)} • {lastSyncedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </div>
          )}
        </div>`;

    app = app.replace(offlineBannerOld, offlineBannerNew);

    fs.writeFileSync('src/App.tsx', app);
}
