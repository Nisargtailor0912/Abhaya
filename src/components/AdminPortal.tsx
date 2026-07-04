import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { ShieldAlert, LogOut, MapPin, CheckCircle, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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

  useEffect(() => {
    const q = query(collection(db, 'emergencies'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const emgs: Emergency[] = [];
      snapshot.forEach((docSnap) => {
        emgs.push({ id: docSnap.id, ...docSnap.data() } as Emergency);
      });
      setEmergencies(emgs);
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch emergencies:", err);
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
  const defaultPosition: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rose-500" size={24} />
          <h1 className="text-xl font-bold">Abhaya Admin Portal</h1>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar / List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeEmergencies.length > 0 ? 'bg-rose-400' : 'bg-slate-300'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${activeEmergencies.length > 0 ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
              </span>
              Live Requests ({activeEmergencies.length})
            </h2>
            
            {loading ? (
              <p className="text-slate-500 text-sm">Loading emergencies...</p>
            ) : emergencies.length === 0 ? (
              <p className="text-slate-500 text-sm">No emergencies reported yet.</p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                {emergencies.map((emg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={emg.id} 
                    className={`p-4 rounded-xl border ${emg.status === 'active' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${emg.status === 'active' ? 'text-rose-900' : 'text-slate-700'}`}>
                        {emg.userName}
                      </h3>
                      {emg.status === 'active' ? (
                        <span className="text-xs bg-rose-500 text-white px-2 py-1 rounded-md font-medium uppercase">Active</span>
                      ) : (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-md font-medium uppercase">Resolved</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {emg.location.latitude ? `${emg.location.latitude.toFixed(4)}, ${emg.location.longitude?.toFixed(4)}` : 'Unknown Location'}</p>
                      <p className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {emg.timestamp?.toDate ? emg.timestamp.toDate().toLocaleString() : 'Just now'}</p>
                      {emg.userPhone && <p className="text-slate-500 mt-1">Phone: {emg.userPhone}</p>}
                      <p className="text-slate-500">Email: {emg.userEmail}</p>
                    </div>
                    {emg.status === 'active' && (
                      <button 
                        onClick={() => handleResolve(emg.id)}
                        className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={16} /> Mark as Resolved
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 h-[500px] lg:h-auto min-h-[500px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
          <MapContainer 
            center={defaultPosition} 
            zoom={4} 
            scrollWheelZoom={true} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {emergencies.map((emg) => {
              if (emg.location.latitude && emg.location.longitude) {
                return (
                  <Marker 
                    key={emg.id} 
                    position={[emg.location.latitude, emg.location.longitude]}
                    opacity={emg.status === 'active' ? 1 : 0.6}
                  >
                    <Popup>
                      <div className="font-sans">
                        <h4 className="font-bold text-sm mb-1">{emg.userName}</h4>
                        <p className="text-xs text-slate-600 mb-1">{emg.userPhone}</p>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${emg.status === 'active' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {emg.status}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>

      </main>
    </div>
  );
}
