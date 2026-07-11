const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace location effect
const locationEffectStart = content.indexOf('  useEffect(() => {\n    if (!settings.locationTracking');
const locationEffectEnd = content.indexOf('  }, [settings.locationTracking, settings.locationAccuracy]);') + 63;

if (locationEffectStart !== -1) {
  const newLocationEffect = `  useEffect(() => {
    if (!settings.locationTracking || !('geolocation' in navigator)) {
      if (!('geolocation' in navigator)) {
        setLocation(prev => ({ ...prev, error: "Geolocation not supported by device." }));
      }
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        let errorMsg = error.message;
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Poor GPS signal. Searching for location...";
        }
        setLocation((prev) => ({ ...prev, error: errorMsg }));
      },
      { enableHighAccuracy: settings.locationAccuracy !== false, timeout: 15000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [settings.locationTracking, settings.locationAccuracy]);`;
  
  content = content.substring(0, locationEffectStart) + newLocationEffect + content.substring(locationEffectEnd);
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx location patched');
} else {
  console.log('Location effect not found');
}
