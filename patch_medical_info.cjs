const fs = require('fs');

let content = fs.readFileSync('src/components/MedicalInfoView.tsx', 'utf8');

const newComponent = `import React, { useEffect, useState } from 'react';
import { ShieldAlert, Phone, Activity, AlertCircle, MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';

function PlacesLocator({ type, location }: { type: 'hospital' | 'police', location: {lat: number, lng: number} }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !map || !location) return;
    
    // Quick search nearby
    const request = {
      textQuery: type,
      fields: ['displayName', 'location', 'formattedAddress'],
      locationBias: location,
      maxResultCount: 5,
    };
    
    placesLib.Place.searchByText(request).then(({ places }) => {
      setPlaces(places || []);
    }).catch(e => console.error("Places search failed", e));
  }, [placesLib, map, type, location]);

  return (
    <>
      {places.map(p => (
        <AdvancedMarker key={p.id} position={p.location} title={p.displayName}>
           <div className="flex flex-col items-center">
              <div className={\`text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm mb-1 \${type === 'police' ? 'bg-blue-600' : 'bg-rose-600'}\`}>
                {p.displayName}
              </div>
              <div className={\`w-3 h-3 rounded-full border border-white shadow-sm \${type === 'police' ? 'bg-blue-600' : 'bg-rose-600'}\`}></div>
            </div>
        </AdvancedMarker>
      ))}
    </>
  );
}

export default function MedicalInfoView({ data }: { data: any }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchType, setSearchType] = useState<'hospital' | 'police' | null>(null);

  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };
    handleThemeChange();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [theme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : prev === 'light' ? 'system' : 'dark');
  };

  const handleSearch = (type: 'hospital' | 'police') => {
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSearchType(type);
        },
        (err) => {
          console.error("Could not get location", err);
          // Fallback to open external Google Maps if location access is denied
          window.open(\`https://www.google.com/maps/search/\${type}+near+me\`, '_blank');
        }
      );
    } else {
      setSearchType(type);
    }
  };

  return (
    <div className={\`min-h-screen \${isDark ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 flex flex-col items-center\`}>
      <div className="w-full max-w-md mt-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Emergency Info</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Abhaya Safety App</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
          </button>
        </div>

        {/* Patient Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold mb-6">{data.name || 'Unknown Person'}</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Blood Group</p>
                <p className="font-semibold text-lg">{data.blood || 'Unknown'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Emergency Phone</p>
                <p className="font-semibold text-lg">{data.phone || 'N/A'}</p>
                {data.phone && (
                  <a href={\`tel:\${data.phone}\`} className="text-sm text-blue-600 dark:text-blue-400 font-medium inline-flex items-center gap-1 mt-1">
                    Call Now
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Medical Conditions / Allergies</p>
                <p className="font-medium mt-1">{data.conditions || 'None reported'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {data.note && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-rose-50 dark:bg-rose-900/20 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/50"
          >
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-2">Emergency Note</p>
            <p className="text-rose-700 dark:text-rose-200">{data.note}</p>
          </motion.div>
        )}

        {/* Nearby Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4"
        >
          <h3 className="font-bold flex items-center gap-2">
            <MapPin size={20} className="text-emerald-500" />
            Nearby Emergency Services
          </h3>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleSearch('hospital')}
              className={\`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors \${searchType === 'hospital' ? 'bg-rose-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}
            >
              <Activity size={18} />
              <span className="font-medium text-sm">Hospitals</span>
            </button>

            <button 
              onClick={() => handleSearch('police')}
              className={\`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors \${searchType === 'police' ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}
            >
              <ShieldAlert size={18} />
              <span className="font-medium text-sm">Police</span>
            </button>
          </div>
          
          {searchType && userLocation && API_KEY && (
            <div className="w-full h-[250px] rounded-xl overflow-hidden mt-4 relative">
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={userLocation}
                  defaultZoom={14}
                  mapId="EMERGENCY_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  <AdvancedMarker position={userLocation}>
                     <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                  </AdvancedMarker>
                  <PlacesLocator type={searchType} location={userLocation} />
                </Map>
              </APIProvider>
            </div>
          )}
          {searchType && userLocation && !API_KEY && (
            <div className="w-full p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl text-sm mt-4">
              <p className="font-medium flex items-center gap-2"><AlertCircle size={16}/> Map API Key Missing</p>
              <p className="mt-1">Please add the Google Maps API key to see the map, or click the buttons again to open in Google Maps directly.</p>
              <button onClick={() => window.open(\`https://www.google.com/maps/search/\${searchType}+near+me\`, '_blank')} className="mt-2 text-amber-700 dark:text-amber-300 underline font-medium">Open external map instead</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/MedicalInfoView.tsx', newComponent);
console.log('Updated MedicalInfoView.tsx to show inline Google Map');
