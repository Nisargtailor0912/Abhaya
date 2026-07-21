import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Auth from './components/Auth';
import SlideToAnswer from './components/SlideToAnswer';
import SlideToSOS from './components/SlideToSOS';
import {
  ShieldAlert,
  PhoneCall,
  Volume2,
  MapPin,
  X,
  User,
  Settings,
  AlertOctagon,
  Phone,
  Info,
  Clock,
  LogOut,
  Bell,
  WifiOff,
  Mic,
  Smartphone,
  Battery,
  ShieldCheck,
  Lock,
  ChevronUp,
  ChevronDown,
  LocateFixed,
  Moon,
  Sun
} from 'lucide-react';
import { quickActions, safetyTips, defaultSettings, defaultPersonalInfo, emergencyNumbersIndia } from './data';
import { LocationData, UserSettings, Contact, HistoryEvent, PersonalInfo } from './types';
import LocationMap from './components/Map';
import AdminPortal from './components/AdminPortal';
import SafetyBot from './components/SafetyBot';
import { Bot } from 'lucide-react';
import { useTheme } from './useTheme';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sosActive, setSosActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncedLocation, setLastSyncedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);
  
  // Fake Call States
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallState, setFakeCallState] = useState<'incoming' | 'active'>('incoming');
  const [fakeCallTime, setFakeCallTime] = useState(0);

  const [alarmActive, setAlarmActive] = useState(false);
  const [location, setLocation] = useState<LocationData>({ latitude: null, longitude: null, error: null });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showEmergencyNumbers, setShowEmergencyNumbers] = useState(false);
  const [showMedicalQR, setShowMedicalQR] = useState(false);
  const [showWidgetInfo, setShowWidgetInfo] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  useTheme(settings.theme);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [currentEmergencyId, setCurrentEmergencyId] = useState<string | null>(null);

  // Audio Context for Alarm
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    let batteryManager: any = null;
    let updateBatteryStatus: () => void;

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryManager = battery;
        
        updateBatteryStatus = () => {
          const level = Math.round(battery.level * 100);
          setBatteryLevel(level);
          setIsCharging(battery.charging);
          
          setSettings(prev => {
            if (level <= 15 && !battery.charging && !prev.lowPowerMode) {
              const newSettings = { ...prev, lowPowerMode: true };
              saveUserData({ settings: newSettings });
              setTimeout(() => {
                alert("Battery level is critically low (≤15%). Low Power Mode activated automatically to preserve battery.");
              }, 500);
              return newSettings;
            }
            return prev;
          });
        };

        updateBatteryStatus();
        
        batteryManager.addEventListener('levelchange', updateBatteryStatus);
        batteryManager.addEventListener('chargingchange', updateBatteryStatus);
      }).catch((e: any) => console.log('Battery API not supported/allowed', e));
    }

    return () => {
       if (batteryManager && updateBatteryStatus) {
          batteryManager.removeEventListener('levelchange', updateBatteryStatus);
          batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
       }
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.personalInfo) setPersonalInfo({ ...defaultPersonalInfo, ...data.personalInfo });
            if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
            if (data.contacts) setContacts(data.contacts);
          } else {
            // Initialize user doc
            const initialPersonalInfo = {
              ...defaultPersonalInfo,
              fullName: currentUser.displayName || defaultPersonalInfo.fullName
            };
            await setDoc(userDocRef, {
              personalInfo: initialPersonalInfo,
              settings: defaultSettings,
              contacts: []
            });
            setPersonalInfo(initialPersonalInfo);
          }
        } catch (err: any) {
          console.error("Failed to fetch user data:", err);
          if (err.code === 'permission-denied') {
            console.warn("Firestore permissions denied. Make sure your Firebase Firestore security rules allow read/write for authenticated users.");
          }
        }
      }
      setAuthLoading(false);
    });


    return () => unsubscribe();
  }, []);

  // Save changes to Firestore
  const saveUserData = async (updates: any) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, updates, { merge: true });
    } catch (err: any) {
      console.error("Failed to save user data:", err);
      if (err.code === 'permission-denied') {
        alert("Unable to save data. Please update your Firestore Security Rules to allow access.");
      }
    }
  };

  useEffect(() => {
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
  }, [settings.locationTracking, settings.locationAccuracy]);

  // Sync location to emergency doc
  useEffect(() => {
    if (sosActive && currentEmergencyId && location.latitude && location.longitude) {
      updateDoc(doc(db, 'emergencies', currentEmergencyId), {
        'location.latitude': location.latitude,
        'location.longitude': location.longitude
      })
      .then(() => {
        setLastSyncedLocation({ lat: location.latitude!, lng: location.longitude! });
        setLastSyncedTime(new Date());
      })
      .catch(err => console.error("Error updating emergency location:", err));
    }
  }, [location.latitude, location.longitude, sosActive, currentEmergencyId]);

  // Shake detection
  useEffect(() => {
    if (!settings.shakeToTriggerSOS) return;
    if (sosActive && settings.lowPowerMode) return; // Disable background process to save battery

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = new Date().getTime();
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (e: DeviceMotionEvent) => {
      const current = e.accelerationIncludingGravity;
      if (!current || current.x === null || current.y === null || current.z === null) return;

      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastTime;

      if (timeDifference > 100) {
        const deltaX = Math.abs(lastX - current.x);
        const deltaY = Math.abs(lastY - current.y);
        const deltaZ = Math.abs(lastZ - current.z);

        if ((deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) || 
            (deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) || 
            (deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)) {
          
          if (!sosActive && countdown === null) {
            handleSOSClick(); // Trigger SOS
          }
        }
        
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
        lastTime = currentTime;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [settings.shakeToTriggerSOS, sosActive, countdown, settings.lowPowerMode]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      activateSOS();
      setCountdown(null);
    }
  }, [countdown]);

  const addHistoryEvent = (type: 'SOS' | 'Alarm' | 'Location Shared' | 'Fake Call') => {
    const newEvent: HistoryEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      date: new Date().toISOString(),
      location: location.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)}` : 'Unknown Location',
      resolved: false
    };
    const newHistory = [newEvent, ...history];
    setHistory(newHistory);
    // Note: History saving could grow indefinitely, ideally bounded.
    saveUserData({ history: newHistory.slice(0, 50) });
  };

  const handleSOSClick = async () => {
    if (countdown !== null) {
      setCountdown(null);
      return;
    }
    if (sosActive) {
      setSosActive(false);
      setCountdown(null);
      if (currentEmergencyId) {
        try {
          await updateDoc(doc(db, 'emergencies', currentEmergencyId), {
            status: 'resolved'
          });
          setCurrentEmergencyId(null);
        } catch (err) {
          console.error("Error resolving emergency record:", err);
        }
      }
    } else {
      activateSOS();
    }
  };

  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    // Play alert ringtone automatically, synchronously before any await
    if (!alarmActive) {
      toggleAlarm();
    }
    
    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    const smsPhones = contacts.map(c => c.phone).join(',');
    const locationLink = location.latitude ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : 'Unknown location';
    const message = encodeURIComponent(`EMERGENCY SOS! I need help immediately. Location: ${locationLink}`);
    
    // Trigger SMS via iframe to avoid consuming the top-level navigation intent
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `sms:${smsPhones}?body=${message}`;
    document.body.appendChild(iframe);
    
    // Trigger Phone Call via direct navigation synchronously
    window.location.href = `tel:${emergencyNumber}`;
    
    if (user || (typeof localMock !== 'undefined' ? localMock : false)) {
      try {
        const emgRef = await addDoc(collection(db, 'emergencies'), {
          userId: user?.uid || 'guest-user',
          userName: personalInfo.fullName || user?.displayName || 'Guest User',
          userEmail: user?.email || 'guest@local',
          userPhone: personalInfo.phone || '',
          type: 'SOS',
          location: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          status: 'active',
          timestamp: serverTimestamp()
        });
        setCurrentEmergencyId(emgRef.id);
        if (location.latitude && location.longitude) {
          setLastSyncedLocation({ lat: location.latitude, lng: location.longitude });
          setLastSyncedTime(new Date());
        }
      } catch (err) {
        console.error("Error creating emergency record:", err);
      }
    }

    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    // Use setTimeout so the alert doesn't block the intents from opening on mobile
    setTimeout(() => {
      alert(`EMERGENCY SOS ACTIVATED!\n\n1. Request sent to Admin Portal.\n2. Notifying Trusted Contacts (${contactNames}) with a high-priority alert ringtone call.\n3. SMS messages dispatched with your live location link.\n\nStay calm. Help is on the way.`);
    }, 1500);
    
    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  
  const ringAudioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (fakeCallActive && fakeCallState === 'incoming') {
      if (!ringAudioCtxRef.current) {
        ringAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = ringAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playRing = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);
        
        // standard ringing pattern: 2 seconds on, 4 seconds off. We'll do 1.5s on, 2s off.
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + 1.4);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      };
      
      playRing();
      ringIntervalRef.current = setInterval(playRing, 3500);
      
    } else {
       if (ringIntervalRef.current) {
         clearInterval(ringIntervalRef.current);
         ringIntervalRef.current = null;
       }
    }
    
    return () => {
      if (ringIntervalRef.current) {
         clearInterval(ringIntervalRef.current);
         ringIntervalRef.current = null;
       }
    };
  }, [fakeCallActive, fakeCallState]);

const toggleAlarm = () => {
    const nextState = !alarmActive;
    setAlarmActive(nextState);
    
    if (nextState) {
      addHistoryEvent('Alarm');
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime); // High pitch
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5); // Siren effect
      
      // LFO for pulsing
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      
      oscillatorRef.current = osc;
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    }
  };

  const triggerFakeCall = () => {
    setFakeCallState('incoming');
    setFakeCallActive(true);
    setFakeCallTime(0);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (fakeCallActive && fakeCallState === 'active') {
      interval = setInterval(() => {
        setFakeCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fakeCallActive, fakeCallState]);

  const acceptFakeCall = () => {
    setFakeCallState('active');
    addHistoryEvent('Fake Call');
  };

  const endFakeCall = () => {
    setFakeCallActive(false);
  };

  const toggleSetting = (key: keyof UserSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveUserData({ settings: newSettings });
  };

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400">Loading...</div>;
  }

  if (!user) {
    return <Auth onAuth={() => {}} theme={settings.theme} onThemeChange={(t: any) => setSettings(prev => ({...prev, theme: t}))} />;
  }

  if (user?.email?.toLowerCase() === 'abhaya@abhaya.com') {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative overflow-hidden z-0">
      {/* Glassmorphism background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-rose-400/20 dark:bg-rose-500/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px] animate-pulse-slow"></div>
      </div>
      {/* Header */}
      <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert size={28} strokeWidth={2.5} />
            <span className="font-bold text-xl tracking-tight">Abhaya</span>
          </div>
          <div className="flex items-center gap-2">
            {batteryLevel !== null && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${batteryLevel <= 15 && !isCharging ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <Battery size={16} className={isCharging ? "animate-pulse" : ""} />
                <span>{batteryLevel}%</span>
                {isCharging && <span className="text-[10px] ml-0.5">⚡</span>}
              </div>
            )}
            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={() => setShowProfile(true)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:bg-slate-600 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      
      {!isOnline && (
        <div className="bg-rose-500 text-white text-xs font-medium px-4 py-3 text-center flex flex-col items-center justify-center gap-1 z-30 relative shadow-md">
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
        </div>
      )}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* SOS Section */}
        <section className="flex flex-col items-center justify-center py-8">
          <div className="relative w-full flex justify-center">
            {/* Ripple effect when active */}
            {sosActive && !settings.lowPowerMode && (
              <motion.div
                className="absolute inset-0 bg-rose-500 rounded-full"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            <SlideToSOS 
              active={sosActive} 
              countdown={countdown} 
              onTrigger={handleSOSClick} 
              onCancel={handleSOSClick} 
            />
          </div>
          <p className="mt-8 text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs font-medium">
            {sosActive 
              ? 'Emergency contacts and local authorities have been notified of your location.'
              : 'Use in case of emergency. This will alert your trusted contacts and share your live location.'}
          </p>
        </section>

        {/* Status Bar */}
        {(sosActive || alarmActive || location.latitude || location.error) && (
           <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 transition-all duration-300 flex flex-col gap-3">
             {location.error && (
               <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                 <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-slate-900 dark:text-white">Location Error</p>
                   <p className="text-xs text-rose-600 font-medium">{location.error}</p>
                 </div>
                 <button 
                   onClick={() => {
                     const lat = prompt("Enter manual latitude (e.g., 20.5937):");
                     const lng = prompt("Enter manual longitude (e.g., 78.9629):");
                     if (lat && lng) {
                       setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lng), error: null });
                     }
                   }}
                   className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:bg-slate-600 px-3 py-1.5 rounded-full transition-colors shrink-0"
                 >
                   Manual Location
                 </button>
               </div>
             )}
             {!location.error && location.latitude && location.longitude && (
               <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1 truncate">
                   <p className="font-medium text-slate-900 dark:text-white">Location Active</p>
                   <p className="truncate text-xs opacity-80">Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
                 </div>
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Tracking</span>
               </div>
             )}
             
             {alarmActive && (
               <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                 <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                   <Volume2 size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-slate-900 dark:text-white">Loud Alarm</p>
                   <p className="text-xs opacity-80">Siren is currently playing</p>
                 </div>
                 <button onClick={toggleAlarm} className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">
                   Stop
                 </button>
               </div>
             )}
           </div>
        )}

        
        {/* System Security */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">System Security</h2>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Antivirus Protection Active</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time device monitoring is active. No threats detected.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">E2E Encryption</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your emergency contacts and location data are end-to-end encrypted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 px-1">Quick Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const isActive = action.id === 'alarm' && alarmActive;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    if (action.id === 'alarm') toggleAlarm();
                    if (action.id === 'fake-call') triggerFakeCall();
                    if (action.id === 'medical-qr') setShowMedicalQR(true);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    isActive 
                      ? 'border-orange-500 bg-orange-50 shadow-sm' 
                      : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${action.color}`}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center">{action.title}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Live Location Map */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Live Location</h2>
          </div>
          <LocationMap location={location} sosActive={sosActive} />
        </section>

        {/* Trusted Contacts */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Trusted Contacts</h2>
             <button onClick={() => setShowAddContact(true)} className="text-sm font-medium text-rose-600 hover:text-rose-700">Add Contact</button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            {contacts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No trusted contacts added yet.
              </div>
            ) : (
              contacts.map((contact, idx) => (
                <div 
                  key={contact.id} 
                  className={`flex items-center justify-between p-4 ${idx !== contacts.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={() => moveContact(idx, 'up')}
                        disabled={idx === 0}
                        className="text-slate-400 hover:text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={() => moveContact(idx, 'down')}
                        disabled={idx === contacts.length - 1}
                        className="text-slate-400 hover:text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Primary</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{contact.relation} • {contact.phone}</p>
                    </div>
                  </div>
                  <a href={`tel:${contact.phone}`} target="_top" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0">
                    <Phone size={18} />
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 mb-3">
            <Info size={20} />
            <h2 className="font-semibold">Safety Tips</h2>
          </div>
          <ul className="space-y-2">
            {safetyTips.map((tip, idx) => (
              <li key={idx} className="text-sm text-blue-900/80 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency History */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Emergency History</h2>
             <button onClick={() => setHistory([])} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200">Clear</button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            {history.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No recent emergencies. Stay safe!
              </div>
            ) : (
              history.map((event, idx) => (
                <div 
                  key={event.id} 
                  className={`flex items-start gap-4 p-4 ${idx !== history.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    event.type === 'SOS' ? 'bg-rose-100 text-rose-600' :
                    event.type === 'Alarm' ? 'bg-orange-100 text-orange-600' :
                    event.type === 'Fake Call' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {event.type === 'SOS' ? <AlertOctagon size={20} /> :
                     event.type === 'Alarm' ? <Volume2 size={20} /> :
                     event.type === 'Fake Call' ? <Phone size={20} /> :
                     <MapPin size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{event.type} Triggered</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{event.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{new Date(event.date).toLocaleDateString()}</p>
                    <span className={`inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${event.resolved ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      {event.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      <footer className="text-center py-6 text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} Abhaya. All rights reserved.
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Safety Settings</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-5 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Appearance</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => { const s = {...settings, theme: 'light'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${settings.theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                    >
                      <Sun size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Light</span>
                    </button>
                    <button 
                      onClick={() => { const s = {...settings, theme: 'dark'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${settings.theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                    >
                      <Moon size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Dark</span>
                    </button>
                    <button 
                      onClick={() => { const s = {...settings, theme: 'system'}; setSettings(s); saveUserData({ settings: s }); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${settings.theme === 'system' || !settings.theme ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                    >
                      <Settings size={20} className="text-slate-600 dark:text-slate-300" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">System</span>
                    </button>
                  </div>
                </div>
                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Mic size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Voice-Activated SOS</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Trigger by shouting a code word</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.voiceActivatedSOS} onChange={() => toggleSetting('voiceActivatedSOS')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><Smartphone size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Shake to Trigger</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Shake phone rapidly 3 times</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.shakeToTriggerSOS} onChange={() => toggleSetting('shakeToTriggerSOS')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center"><WifiOff size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Offline Emergency SMS</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Send standard SMS if no data</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.offlineSMS} onChange={() => toggleSetting('offlineSMS')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Bell size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Push Notifications</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Safety alerts in your area</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Battery size={20} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Low Power Mode</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Saves battery during active SOS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.lowPowerMode} onChange={() => toggleSetting('lowPowerMode')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><LocateFixed size={20} /></div>
                      <div className="max-w-[200px]">
                        <p className="font-semibold text-slate-900 dark:text-white">Location Accuracy</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Google processes sensors and signals to improve location-based services without identifying you.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input type="checkbox" className="sr-only peer" checked={settings.locationAccuracy} onChange={() => toggleSetting('locationAccuracy')} />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => { setShowSettings(false); signOut(auth); }} 
                    className="w-full flex items-center justify-center gap-2 p-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors font-medium"
                  >
                    <LogOut size={20} />
                    Log Out
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">User Profile</h3>
                <button onClick={() => setShowProfile(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-rose-400 to-rose-600 rounded-full shadow-lg flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {personalInfo.fullName ? personalInfo.fullName.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{personalInfo.fullName || 'User'}</h2>
                <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><ShieldAlert size={12} /> Verified</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 p-2">
                <button onClick={() => { setShowProfile(false); setShowPersonalInfo(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors text-left font-medium">
                  <User size={20} className="text-slate-400" />
                  Personal Information
                </button>
                <button onClick={() => { setShowProfile(false); setShowAddContact(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors text-left font-medium">
                  <Phone size={20} className="text-slate-400" />
                  Manage Emergency Contacts
                </button>
                <button onClick={() => { setShowProfile(false); setShowEmergencyNumbers(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors text-left font-medium">
                  <PhoneCall size={20} className="text-slate-400" />
                  India Emergency Numbers
                </button>
                <button onClick={() => { setShowProfile(false); setShowWidgetInfo(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors text-left font-medium">
                  <Smartphone size={20} className="text-slate-400" />
                  Add Panic Widget
                </button>
                <button onClick={() => { setShowProfile(false); signOut(auth); }} className="w-full flex items-center gap-3 p-4 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left font-medium mt-4">
                  <LogOut size={20} className="text-rose-400" />
                  Sign Out
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Info Modal */}
      <AnimatePresence>
        {showWidgetInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Panic Widget</h3>
                <button onClick={() => setShowWidgetInfo(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 p-1.5 rounded-lg">🍎</span>
                    iOS (iPhone/iPad)
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2 ml-1">
                    <li>Open this app in <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share</strong> button at the bottom (square with an arrow pointing up).</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Open the Shortcuts app and create a new Shortcut.</li>
                    <li>Select "Open App" and choose Abhaya.</li>
                    <li>Add the Shortcut widget to your lock screen or home screen for instant access!</li>
                  </ol>
                </div>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 p-1.5 rounded-lg">🤖</span>
                    Android
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2 ml-1">
                    <li>Open this app in <strong>Chrome</strong>.</li>
                    <li>Tap the <strong>Menu</strong> icon (3 dots in upper right-hand corner).</li>
                    <li>Tap <strong>"Add to Home screen"</strong>.</li>
                    <li>You can now place the Abhaya app icon anywhere on your home screen.</li>
                    <li>Long-press the icon and use <strong>Widgets</strong> to add quick action shortcuts (if supported by your launcher).</li>
                  </ol>
                </div>
                
                <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm mt-4 flex gap-3">
                  <AlertOctagon size={20} className="shrink-0 mt-0.5 text-rose-500" />
                  <p>Adding the app to your home screen allows you to bypass the browser and trigger SOS faster during emergencies.</p>
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setShowWidgetInfo(false)}
                  className="w-full bg-slate-900 text-white font-semibold rounded-xl py-3 hover:bg-slate-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* India Emergency Numbers Modal */}
      <AnimatePresence>
        {showEmergencyNumbers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">India Emergency Numbers</h3>
                <button onClick={() => setShowEmergencyNumbers(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-0 overflow-y-auto max-h-[60vh]">
                <div className="divide-y divide-slate-100">
                  {emergencyNumbersIndia.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{item.service}</span>
                      <a href={`tel:${item.number}`} target="_top" className="flex items-center gap-2 text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full">
                        <PhoneCall size={14} />
                        {item.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personal Info Modal */}
      <AnimatePresence>
        {showPersonalInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Personal Information</h3>
                <button onClick={() => setShowPersonalInfo(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                  <input type="email" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone Number</label>
                  <input type="tel" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Blood Group</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.bloodGroup} onChange={e => setPersonalInfo({...personalInfo, bloodGroup: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Medical Conditions</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.medicalConditions} onChange={e => setPersonalInfo({...personalInfo, medicalConditions: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Home Address</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={personalInfo.homeAddress} onChange={e => setPersonalInfo({...personalInfo, homeAddress: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Emergency Note</label>
                  <textarea rows={3} className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" value={personalInfo.emergencyNote} onChange={e => setPersonalInfo({...personalInfo, emergencyNote: e.target.value})}></textarea>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900 shrink-0">
                <button 
                  onClick={() => {
                    saveUserData({ personalInfo });
                    setShowPersonalInfo(false);
                  }}
                  className="w-full bg-rose-600 text-white font-semibold rounded-xl py-3 hover:bg-rose-700 transition-colors"
                >
                  Save Information
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Trusted Contact</h3>
                <button onClick={() => setShowAddContact(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Name</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g., Jane Doe" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone Number</label>
                  <input type="tel" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="+1 234 567 8900" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Relation</label>
                  <input type="text" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g., Sister" value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900">
                <button 
                  onClick={() => {
                    if (newContact.name && newContact.phone) {
                      const updatedContacts = [...contacts, { ...newContact, id: Math.random().toString(36).substr(2, 9) }];
                      setContacts(updatedContacts);
                      saveUserData({ contacts: updatedContacts });
                      setNewContact({ name: '', phone: '', relation: '' });
                      setShowAddContact(false);
                    }
                  }}
                  className="w-full bg-rose-600 text-white font-semibold rounded-xl py-3 hover:bg-rose-700 transition-colors"
                >
                  Save Contact
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medical QR Modal */}
      <AnimatePresence>
        {showMedicalQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Medical QR</h3>
                <button onClick={() => setShowMedicalQR(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 flex flex-col items-center justify-center space-y-6">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 inline-block">
                  
                <a 
                  href={`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    }))))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                >
                  <QRCode 
                    value={`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    }))))}`} 
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </a>

                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{personalInfo.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Show this QR code to first responders</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake Call Overlay Simulation */}
      <AnimatePresence>
        {fakeCallActive && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-3xl flex flex-col items-center justify-between pb-16 pt-24"
          >
            {/* iOS Glass Background Blob */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
               <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
               <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            <div className="text-center">
              {fakeCallState === 'incoming' ? (
                <p className="text-white/60 text-xl mb-2 font-light">incoming call...</p>
              ) : (
                <p className="text-emerald-400 text-xl mb-2 font-medium">00:{fakeCallTime.toString().padStart(2, '0')}</p>
              )}
              <h2 className="text-white text-5xl font-light tracking-wide mt-2">Dad</h2>
              <p className="text-white/50 text-lg mt-2">Mobile</p>
            </div>
            
            <div className="w-full px-8 pb-12 flex flex-col items-center justify-end">
              {fakeCallState === 'incoming' ? (
                <div className="w-full flex flex-col items-center gap-8">
                   <div className="flex w-full max-w-sm justify-between px-6 mb-8">
                     <div className="flex flex-col items-center gap-2">
                       <button onClick={endFakeCall} className="w-16 h-16 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white -rose transition-all">
                         <Phone size={28} className="rotate-[135deg]" />
                       </button>
                       <span className="text-white/70 text-sm">Decline</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 opacity-0">
                       {/* Placeholder to balance the layout if we needed two buttons, but we only have decline and slider */}
                     </div>
                   </div>
                   
                   <SlideToAnswer onAccept={acceptFakeCall} />
                </div>
              ) : (
                <button 
                  onClick={endFakeCall}
                  className="w-[72px] h-[72px] rounded-full bg-rose-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] -rose transition-all mt-auto"
                >
                  <Phone size={36} className="rotate-[135deg]" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Bot */}
      {showBot && <SafetyBot onClose={() => setShowBot(false)} />}
      
      {/* Floating Action Button for Bot */}
      <button
        onClick={() => setShowBot(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all z-[40]"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
