const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetEffect = `  useEffect(() => {
    if (!settings.locationTracking || !('geolocation' in navigator)) return;

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation((prev) => ({ ...prev, error: error.message }));
        }
      );
    };

    // Initial fetch
    fetchLocation();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (sosActive) {
      // If Low Power Mode is on, refresh every 60s, otherwise every 10s
      const intervalMs = settings.lowPowerMode ? 60000 : 10000;
      intervalId = setInterval(fetchLocation, intervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [settings.locationTracking, sosActive, settings.lowPowerMode]);`;

const newEffect = `  useEffect(() => {
    if (!settings.locationTracking || !('geolocation' in navigator)) return;

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
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
            errorMsg = "Poor GPS signal. Please move to an open area or enter location manually.";
          }
          setLocation((prev) => ({ ...prev, error: errorMsg }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Initial fetch
    fetchLocation();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (sosActive) {
      // If Low Power Mode is on, refresh every 60s, otherwise every 10s
      const intervalMs = settings.lowPowerMode ? 60000 : 10000;
      intervalId = setInterval(fetchLocation, intervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [settings.locationTracking, sosActive, settings.lowPowerMode]);`;

if (content.includes(targetEffect)) {
    content = content.replace(targetEffect, newEffect);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated location tracking to handle poor signal.");
} else {
    console.log("Could not find the target location tracking effect.");
}
