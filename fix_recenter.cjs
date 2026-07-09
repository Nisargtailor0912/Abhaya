const fs = require('fs');
let fileMap = 'src/components/Map.tsx';
let contentMap = fs.readFileSync(fileMap, 'utf8');

// update MapUpdater
const oldMapUpdater = `function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
    }
  }, [map, center]);
  
  return null;
}`;
const newMapUpdater = `function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
      map.setZoom(15);
    }
  }, [map, center, trigger]);
  
  return null;
}`;
contentMap = contentMap.replace(oldMapUpdater, newMapUpdater);

// add trigger state
const stateOld = `  const [showSafeRoute, setShowSafeRoute] = useState(false);`;
const stateNew = `  const [showSafeRoute, setShowSafeRoute] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);`;
contentMap = contentMap.replace(stateOld, stateNew);

// update recenter button
const oldRecenter = `          <button 
            onClick={() => setMapCenter({lat: location.latitude!, lng: location.longitude!})}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
          >
            <Navigation size={16} className="text-slate-500" />
            Recenter
          </button>`;
const newRecenter = `          <button 
            onClick={() => {
              setMapCenter({lat: location.latitude!, lng: location.longitude!});
              setRecenterTrigger(prev => prev + 1);
            }}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
          >
            <Navigation size={16} className="text-slate-500" />
            Recenter
          </button>`;
contentMap = contentMap.replace(oldRecenter, newRecenter);

// update MapUpdater usage
const oldMapUpdaterUsage = `<MapUpdater center={mapCenter} />`;
const newMapUpdaterUsage = `<MapUpdater center={mapCenter} trigger={recenterTrigger} />`;
contentMap = contentMap.replace(oldMapUpdaterUsage, newMapUpdaterUsage);

fs.writeFileSync(fileMap, contentMap, 'utf8');

// For AdminPortal.tsx
let fileAdmin = 'src/components/AdminPortal.tsx';
let contentAdmin = fs.readFileSync(fileAdmin, 'utf8');

const oldAdminMapUpdater = `function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  React.useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
}`;
const newAdminMapUpdater = `function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();
  React.useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
      map.setZoom(14);
    }
  }, [map, center, trigger]);
  return null;
}`;
contentAdmin = contentAdmin.replace(oldAdminMapUpdater, newAdminMapUpdater);

const stateAdminOld = `  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);`;
const stateAdminNew = `  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);`;
contentAdmin = contentAdmin.replace(stateAdminOld, stateAdminNew);

const oldAdminMapUpdaterUsage = `<MapUpdater center={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}} />`;
const newAdminMapUpdaterUsage = `<MapUpdater center={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}} trigger={recenterTrigger} />`;
contentAdmin = contentAdmin.replace(oldAdminMapUpdaterUsage, newAdminMapUpdaterUsage);

const adminMapBlockOld = `<APIProvider apiKey={API_KEY} version="weekly">`;
const adminMapBlockNew = `
          {selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude && (
            <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setRecenterTrigger(prev => prev + 1)}
                className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
              >
                <MapPin size={16} className="text-slate-500" />
                Recenter
              </button>
            </div>
          )}
          <APIProvider apiKey={API_KEY} version="weekly">`;
contentAdmin = contentAdmin.replace(adminMapBlockOld, adminMapBlockNew);

fs.writeFileSync(fileAdmin, contentAdmin, 'utf8');

console.log("Updated both maps with Recenter");
