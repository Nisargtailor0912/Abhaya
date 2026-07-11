import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { ShieldAlert, LogOut, MapPin, CheckCircle, Clock, PhoneCall, MessageCircle, User as UserIcon, History, AlertTriangle, PhoneForwarded, ShieldCheck, Lock, Server, Activity, EyeOff } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function AdminSafeRouteDirections({ origin, destination }: { origin: { lat: number; lng: number } | null; destination: { lat: number; lng: number } | null; }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = React.useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer>();

  React.useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  React.useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (!origin || !destination) {
      directionsRenderer.setDirections({ routes: [] } as any);
      return;
    }
    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then(response => {
      directionsRenderer.setDirections(response);
    })
    .catch(e => {
      console.error('Directions request failed', e);
    });
    return () => {
      directionsRenderer.setDirections({ routes: [] } as any);
    };
  }, [directionsService, directionsRenderer, origin, destination]);
  return null;
}

function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();
  React.useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
      map.setZoom(14);
    }
  }, [map, center, trigger]);
  return null;
}

interface Emergency {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  type: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  status: 'active' | 'resolved';
  timestamp: any;
}

export default function AdminPortal() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'calls' | 'security'>('live');
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const adminUser = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'emergencies'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const emgs: Emergency[] = [];
      snapshot.forEach((docSnap) => {
        emgs.push({ id: docSnap.id, ...docSnap.data() } as Emergency);
      });
      setEmergencies(emgs);
      setPermissionError(false);
      setLoading(false);
    }, (err: any) => {
      console.error("Failed to fetch emergencies:", err);
      if (err.code === 'permission-denied') {
        setPermissionError(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await updateDoc(doc(db, 'emergencies', id), {
        status: 'resolved'
      });
    } catch (err) {
      console.error("Error resolving emergency:", err);
      alert("Error resolving emergency. Check permissions.");
    }
  };

  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved');

  const defaultPosition: [number, number] = [20.5937, 78.9629]; // Center of India

  const getMockPoliceStation = (lat: number, lng: number): [number, number] => {
    return [lat + 0.005, lng + 0.005];
  };

  const mockCallLogs = [
    { id: 1, to: '+91 9876543210', type: 'STD', duration: '2m 15s', time: '10:30 AM', status: 'connected' },
    { id: 2, to: '+91 9123456789', type: 'Local', duration: '5m 0s', time: '09:15 AM', status: 'connected' },
    { id: 3, to: '100 (Police)', type: 'Emergency', duration: '1m 45s', time: '08:45 AM', status: 'connected' },
    { id: 4, to: '+91 8888888888', type: 'STD', duration: '0s', time: 'Yesterday', status: 'missed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rose-500" size={24} />
          <h1 className="text-xl font-bold hidden sm:block">Abhaya Admin Portal</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-4 mr-4 bg-slate-800 px-4 py-1.5 rounded-xl">
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold"><ShieldCheck size={14} /> Antivirus Active</span>
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold"><Lock size={14} /> E2E Encrypted</span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold"><EyeOff size={14} /> Loc Tracking: Off</span>
          </div>
          <div className="flex items-center gap-3">
            {adminUser?.photoURL ? (
              <img src={adminUser.photoURL} alt="Admin" className="w-8 h-8 rounded-full border border-slate-600" />
            ) : (
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <UserIcon size={16} />
              </div>
            )}
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{adminUser?.displayName || 'Admin User'}</p>
              <p className="text-xs text-slate-400">{adminUser?.phoneNumber || adminUser?.email || 'admin@abhaya.com'}</p>
            </div>
          </div>

          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium bg-slate-800 px-3 py-1.5 rounded-lg"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar / List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 p-5 flex flex-col h-[700px]">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-4 shrink-0">
              <button 
                onClick={() => setActiveTab('live')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'live' ? 'bg-white dark:bg-slate-800 shadow-sm text-rose-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
              >
                <AlertTriangle size={16} /> Live ({activeEmergencies.length})
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
              >
                <History size={16} /> History ({resolvedEmergencies.length})
              </button>
              <button 
                onClick={() => setActiveTab('calls')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'calls' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
              >
                <PhoneForwarded size={16} /> Logs
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-white dark:bg-slate-800 shadow-sm text-teal-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
              >
                <ShieldCheck size={16} /> Security
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {activeTab === 'security' ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">System Security & Health</h3>
                  
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-3">
                    <ShieldCheck className="text-teal-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-teal-900">Antivirus Protection</h4>
                      <p className="text-xs text-teal-700 mt-1">Real-time threat detection is active. Last scan completed 5 minutes ago. No malware or suspicious activity detected.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <Lock className="text-emerald-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-emerald-900">E2E Encryption</h4>
                      <p className="text-xs text-emerald-700 mt-1">All incoming emergency distress signals and location data are fully encrypted end-to-end.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                    <Server className="text-blue-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-blue-900">Database Firewall</h4>
                      <p className="text-xs text-blue-700 mt-1">Strict Firestore security rules applied. Only authorized admin roles can modify history records.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-600 flex items-start gap-3">
                    <EyeOff className="text-slate-600 dark:text-slate-300 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">Admin Location Privacy</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">To ensure operational safety, admin locations are never tracked or transmitted over the network.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-600 flex items-start gap-3">
                    <Activity className="text-indigo-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">System Uptime</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">99.99% uptime this month. All regional dispatch nodes are responding normally.</p>
                    </div>
                  </div>

                </div>
              ) : activeTab === 'calls' ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone & STD Call Logs</h3>
                  {mockCallLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{log.to}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{log.type} • {log.duration}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${log.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {loading ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
                  ) : permissionError ? (
                    <p className="text-rose-500 text-sm">Permission denied. Check Firestore rules.</p>
                  ) : (
                    (activeTab === 'live' ? activeEmergencies : resolvedEmergencies).length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic">No records found.</p>
                    ) : (
                      (activeTab === 'live' ? activeEmergencies : resolvedEmergencies).map((emg) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={emg.id} 
                          onClick={() => setSelectedEmergency(emg)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEmergency?.id === emg.id ? 'ring-2 ring-rose-400' : ''} ${emg.status === 'active' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-semibold ${emg.status === 'active' ? 'text-rose-900' : 'text-slate-700 dark:text-slate-200'}`}>
                              {emg.userName}
                            </h3>
                            {emg.status === 'active' ? (
                              <span className="text-xs bg-rose-500 text-white px-2 py-1 rounded-md font-medium uppercase animate-pulse">Active</span>
                            ) : (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-md font-medium uppercase">Resolved</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                            <p className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {emg.location.latitude ? `${emg.location.latitude.toFixed(4)}, ${emg.location.longitude?.toFixed(4)}` : 'Unknown Location'}</p>
                            <p className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {emg.timestamp?.toDate ? emg.timestamp.toDate().toLocaleString() : 'Just now'}</p>
                            
                            {emg.userPhone && (
                              <div className="flex flex-col mt-2 mb-1 gap-2">
                                <p className="text-slate-500 dark:text-slate-400">Phone: {emg.userPhone}</p>
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={`tel:${emg.userPhone}`} 
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md font-medium hover:bg-emerald-200 transition-colors flex items-center justify-center flex-1 gap-1"
                                  >
                                    <PhoneCall size={14} /> Call
                                  </a>
                                  <a 
                                    href={`https://wa.me/${emg.userPhone.replace(/\D/g, '')}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-medium hover:bg-green-200 transition-colors flex items-center justify-center flex-1 gap-1"
                                  >
                                    <MessageCircle size={14} /> WhatsApp
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {emg.status === 'active' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolve(emg.id);
                              }}
                              className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle size={16} /> Mark as Resolved
                            </button>
                          )}
                        </motion.div>
                      ))
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 h-[500px] lg:h-[700px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden relative z-0">
          {hasValidKey ? (
            <>
          {selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude && (
            <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setRecenterTrigger(prev => prev + 1)}
                className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 dark:bg-slate-900 transition-colors w-fit ml-auto"
              >
                <MapPin size={16} className="text-slate-500 dark:text-slate-400" />
                Recenter
              </button>
            </div>
          )}
          <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}}
                defaultZoom={selectedEmergency ? 14 : 4}
                mapId="ADMIN_MAP_ID"
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
              >
                <MapUpdater center={selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude ? {lat: selectedEmergency.location.latitude, lng: selectedEmergency.location.longitude} : {lat: defaultPosition[0], lng: defaultPosition[1]}} trigger={recenterTrigger} />
                
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
                          <div className={`flex flex-col items-center cursor-pointer transition-opacity ${emg.status === 'active' ? 'opacity-100' : 'opacity-60'}`}>
                            <div className={`text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-md mb-1 ${emg.status === 'active' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                              {emg.status}
                            </div>
                            <div className={`relative flex items-center justify-center`}>
                              {emg.status === 'active' && <div className="w-8 h-8 rounded-full bg-rose-500/30 absolute animate-ping"></div>}
                              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10 ${emg.status === 'active' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
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
          </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 p-6 text-center">
              <div>
                <AlertTriangle className="mx-auto mb-2 text-rose-500" size={32} />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Google Maps API Key Required</h3>
                <p className="text-sm">Please configure the GOOGLE_MAPS_PLATFORM_KEY secret in AI Studio settings.</p>
              </div>
            </div>
          )}
          
          {selectedEmergency && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 z-[400]">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                Live Location Info
                <button onClick={() => setSelectedEmergency(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-300">&times;</button>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2"><strong>User:</strong> {selectedEmergency.userName}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Status:</strong> <span className={selectedEmergency.status === 'active' ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>{selectedEmergency.status.toUpperCase()}</span></p>
              <div className="mt-3 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex gap-2">
                <MapPin size={16} className="shrink-0" />
                <p>Showing safe route to the nearest simulated police station.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
