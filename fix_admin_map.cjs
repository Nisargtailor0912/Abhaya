const fs = require('fs');
const file = 'src/components/AdminPortal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Leaflet imports
content = content.replace(
  "import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';\nimport 'leaflet/dist/leaflet.css';\nimport L from 'leaflet';\n\n// Fix Leaflet icons\n// @ts-ignore\nimport icon from 'leaflet/dist/images/marker-icon.png';\n// @ts-ignore\nimport iconShadow from 'leaflet/dist/images/marker-shadow.png';\n\nlet DefaultIcon = L.icon({\n    iconUrl: icon,\n    shadowUrl: iconShadow,\n    iconAnchor: [12, 41]\n});\n\nlet PoliceIcon = L.icon({\n    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',\n    shadowUrl: iconShadow,\n    iconAnchor: [12, 41]\n});\n\nL.Marker.prototype.options.icon = DefaultIcon;",
  "import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';\n\nconst API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';\nconst hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';\n\nfunction AdminSafeRouteDirections({ origin, destination }: { origin: { lat: number; lng: number } | null; destination: { lat: number; lng: number } | null; }) {\n  const map = useMap();\n  const routesLibrary = useMapsLibrary('routes');\n  const [directionsService, setDirectionsService] = React.useState<google.maps.DirectionsService>();\n  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer>();\n\n  React.useEffect(() => {\n    if (!routesLibrary || !map) return;\n    setDirectionsService(new routesLibrary.DirectionsService());\n    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({\n      map,\n      suppressMarkers: true,\n      polylineOptions: {\n        strokeColor: '#3b82f6',\n        strokeWeight: 6,\n        strokeOpacity: 0.8\n      }\n    }));\n  }, [routesLibrary, map]);\n\n  React.useEffect(() => {\n    if (!directionsService || !directionsRenderer) return;\n    if (!origin || !destination) {\n      directionsRenderer.setDirections({ routes: [] } as any);\n      return;\n    }\n    directionsService.route({\n      origin,\n      destination,\n      travelMode: google.maps.TravelMode.DRIVING,\n    })\n    .then(response => {\n      directionsRenderer.setDirections(response);\n    })\n    .catch(e => {\n      console.error('Directions request failed', e);\n    });\n    return () => {\n      directionsRenderer.setDirections({ routes: [] } as any);\n    };\n  }, [directionsService, directionsRenderer, origin, destination]);\n  return null;\n}\n\nfunction MapUpdater({ center }: { center: { lat: number; lng: number } }) {\n  const map = useMap();\n  React.useEffect(() => {\n    if (map && center.lat && center.lng) {\n      map.panTo(center);\n    }\n  }, [map, center]);\n  return null;\n}"
);

// Replace MapContainer section
const oldMap = /<MapContainer[\s\S]*?<\/MapContainer>/m;

const newMap = `{hasValidKey ? (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}}
                defaultZoom={selectedEmergency ? 14 : 4}
                mapId="ADMIN_MAP_ID"
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
              >
                <MapUpdater center={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}} />
                
                {emergencies.map((emg) => {
                  if (emg.location.latitude && emg.location.longitude) {
                    const isSelected = selectedEmergency?.id === emg.id;
                    const pos = { lat: emg.location.latitude, lng: emg.location.longitude };
                    const policePos = getMockPoliceStation(pos.lat, pos.lng);

                    return (
                      <React.Fragment key={emg.id}>
                        <AdvancedMarker 
                          position={pos}
                          onClick={() => setSelectedEmergency(emg)}
                        >
                          <div className={\`flex flex-col items-center cursor-pointer transition-opacity \${emg.status === 'active' ? 'opacity-100' : 'opacity-60'}\`}>
                            <div className={\`text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-md mb-1 \${emg.status === 'active' ? 'bg-rose-600' : 'bg-emerald-600'}\`}>
                              {emg.status}
                            </div>
                            <div className={\`relative flex items-center justify-center\`}>
                              {emg.status === 'active' && <div className="w-8 h-8 rounded-full bg-rose-500/30 absolute animate-ping"></div>}
                              <div className={\`w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10 \${emg.status === 'active' ? 'bg-rose-500' : 'bg-emerald-500'}\`}></div>
                            </div>
                          </div>
                        </AdvancedMarker>

                        {/* Show safe route and police station only for selected emergency */}
                        {isSelected && (
                          <>
                            <AdvancedMarker position={{lat: policePos[0], lng: policePos[1]}}>
                              <div className="flex flex-col items-center">
                                <div className="text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1 bg-blue-600">
                                  Police Station
                                </div>
                                <div className="w-4 h-4 rounded-full border-2 border-white shadow-md bg-blue-600"></div>
                              </div>
                            </AdvancedMarker>
                            <AdminSafeRouteDirections 
                              origin={pos}
                              destination={{lat: policePos[0], lng: policePos[1]}}
                            />
                          </>
                        )}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </Map>
            </APIProvider>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-50 text-slate-500 p-6 text-center">
              <div>
                <AlertTriangle className="mx-auto mb-2 text-rose-500" size={32} />
                <h3 className="font-semibold text-slate-800 mb-1">Google Maps API Key Required</h3>
                <p className="text-sm">Please configure the GOOGLE_MAPS_PLATFORM_KEY secret in AI Studio settings.</p>
              </div>
            </div>
          )}`;

content = content.replace(oldMap, newMap);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Admin map');
