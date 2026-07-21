const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix handleSOSClick
app = app.replace(
    /    } else {\n      setCountdown\(3\);\n    }/,
    "    } else {\n      activateSOS();\n    }"
);

// 2. Fix activateSOS
const newActivate = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    // Play alert ringtone automatically, synchronously before any await
    if (!alarmActive) {
      toggleAlarm();
    }
    
    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    const smsPhones = contacts.map(c => c.phone).join(',');
    const locationLink = location.latitude ? \\\`https://maps.google.com/?q=\\\${location.latitude},\\\${location.longitude}\\\` : 'Unknown location';
    const message = encodeURIComponent(\\\`EMERGENCY SOS! I need help immediately. Location: \\\${locationLink}\\\`);
    
    // Trigger SMS via iframe to avoid consuming the top-level navigation intent
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = \\\`sms:\\\${smsPhones}?body=\\\${message}\\\`;
    document.body.appendChild(iframe);
    
    // Trigger Phone Call via direct navigation synchronously
    window.location.href = \\\`tel:\\\${emergencyNumber}\\\`;
    
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
    // Removed blocking alert to allow intents to fire.
    
    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };`;

// We just find the bounds of the existing activateSOS
let startIdx = app.indexOf('  const activateSOS = async () => {');
if (startIdx !== -1) {
    let endIdx = app.indexOf('  };', startIdx) + 4;
    // ensure we are capturing the whole function
    if (app.substring(startIdx, endIdx).includes('alert(')) {
       // it's the right function
       app = app.substring(0, startIdx) + newActivate.replace(/\\\\\\`/g, '`') + app.substring(endIdx);
       fs.writeFileSync('src/App.tsx', app);
       console.log('Successfully patched activateSOS');
    } else {
       console.log('Function did not look right', app.substring(startIdx, startIdx+200));
    }
} else {
    console.log('Could not find activateSOS start');
}
