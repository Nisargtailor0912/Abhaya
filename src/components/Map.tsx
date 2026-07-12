import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { LocationData } from '../types';
import { Navigation } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface LocationMapProps {
  sosActive?: boolean;
  location: LocationData;
}

function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
      map.setZoom(15);
    }
  }, [map, center, trigger]);
  
  return null;
}

function SafeRouteDirections({
  origin,
  destination,
}: {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map, 
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#10b981',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (!origin || !destination) {
      directionsRenderer.setDirections({ routes: [] } as any);
      return;
    }

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then(response => {
        directionsRenderer.setDirections(response);
      })
      .catch(e => {
        console.error("Directions request failed", e);
      });
      
    return () => {
      directionsRenderer.setDirections({ routes: [] } as any);
    };
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

export default function LocationMap({ location, sosActive }: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India
  const [showSafeRoute, setShowSafeRoute] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [safeLocation, setSafeLocation] = useState<{lat: number, lng: number} | null>(null);
  
  type SafeZoneType = 'police' | 'hospital';
  interface SafeZone {
    id: string;
    type: SafeZoneType;
    position: { lat: number; lng: number };
    name: string;
  }
  
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setMapCenter({
        lat: location.latitude,
        lng: location.longitude
      });
    }
  }, [location]);


  useEffect(() => {
    if (sosActive && location.latitude && location.longitude && !showSafeRoute) {
      handleToggleRoute();
    } else if (!sosActive && showSafeRoute) {
      handleToggleRoute(); // turn it off if sos is deactivated
    }
  }, [sosActive, location.latitude, location.longitude, showSafeRoute]);

  const handleToggleRoute = () => {
    if (!showSafeRoute && location.latitude && location.longitude) {
      // Mock nearby safe locations
      const mockZones: SafeZone[] = [
        {
          id: '1',
          type: 'police',
          position: { lat: location.latitude + 0.004, lng: location.longitude + 0.004 },
          name: 'City Police Station'
        },
        {
          id: '2',
          type: 'hospital',
          position: { lat: location.latitude - 0.003, lng: location.longitude + 0.005 },
          name: 'General Hospital'
        },
        {
          id: '3',
          type: 'police',
          position: { lat: location.latitude + 0.002, lng: location.longitude - 0.006 },
          name: 'Metro Police'
        }
      ];
      setSafeZones(mockZones);
      setSafeLocation(mockZones[0].position);
      setShowSafeRoute(true);
    } else {
      setSafeZones([]);
      setSafeLocation(null);
      setShowSafeRoute(false);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 flex flex-col items-center justify-center min-h-[300px] text-center">
        <h3 className="text-lg font-semibold text-rose-800 mb-2">Google Maps API Key Required</h3>
        <p className="text-sm text-slate-600 mb-4 text-left">
          To view your live location on the map, please add your Google Maps Platform API key in AI Studio.
        </p>
        <ul className="text-left text-sm text-slate-600 space-y-2 mb-4 bg-slate-50 p-4 rounded-lg w-full">
          <li>1. Get an API Key from Google Cloud Console</li>
          <li>2. Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
          <li>3. Select <strong>Secrets</strong></li>
          <li>4. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name</li>
          <li>5. Paste your API key as the value</li>
        </ul>
        <p className="text-xs text-slate-500 text-left w-full">The app will rebuild automatically.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      {location.latitude && location.longitude && (
        <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={handleToggleRoute}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Navigation size={16} className={showSafeRoute ? "text-emerald-500" : "text-blue-500"} />
            {showSafeRoute ? 'Clear Route' : 'Get Safe Route'}
          </button>
          <button 
            onClick={() => {
              setMapCenter({lat: location.latitude!, lng: location.longitude!});
              setRecenterTrigger(prev => prev + 1);
            }}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
          >
            <Navigation size={16} className="text-slate-500" />
            Recenter
          </button>
        </div>
      )}
      
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={mapCenter}
          defaultZoom={15}
          mapId="SAFEHER_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false}
          gestureHandling="greedy"
        >
          <MapUpdater center={mapCenter} trigger={recenterTrigger} />
          
          <SafeRouteDirections 
            origin={showSafeRoute && location.latitude ? { lat: location.latitude, lng: location.longitude! } : null}
            destination={safeLocation}
          />
          
          {location.latitude && location.longitude && (
            <AdvancedMarker position={{ lat: location.latitude, lng: location.longitude }}>
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 absolute animate-ping"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md relative z-10"></div>
              </div>
            </AdvancedMarker>
          )}

          {safeZones.map(zone => (
            <AdvancedMarker key={zone.id} position={zone.position}>
              <div className="flex flex-col items-center">
                <div className={`text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1 ${zone.type === 'police' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  {zone.name}
                </div>
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${zone.type === 'police' ? 'bg-blue-600' : 'bg-emerald-600'}`}></div>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
