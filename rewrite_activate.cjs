const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    // Play alert ringtone automatically, synchronously before any await
    if (!alarmActive) {
      toggleAlarm();
    }
    
    if (user || localMock) {
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

    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    
    
    const smsPhones = contacts.map(c => c.phone).join(',');
    const locationLink = location.latitude ? \`https://maps.google.com/?q=\${location.latitude},\${location.longitude}\` : 'Unknown location';
    const message = encodeURIComponent(\`EMERGENCY SOS! I need help immediately. Location: \${locationLink}\`);
    
    // Use anchor tags to trigger intents reliably on mobile
    const smsLink = document.createElement('a');
    smsLink.href = \`sms:\${smsPhones}?body=\${message}\`;
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
    
    // Delay to allow SMS intent to fire before tel intent
    setTimeout(() => {
        const telLink = document.createElement('a');
        telLink.href = \`tel:\${emergencyNumber}\`;
        document.body.appendChild(telLink);
        telLink.click();
        document.body.removeChild(telLink);
    }, 800);

    const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
    // Removed blocking alert to allow intents to fire. Show a non-blocking toast or rely on UI updates.
    // The UI already shows "Active" state.

    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };`;

const replacement = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    // Play alert ringtone automatically, synchronously before any await
    if (!alarmActive) {
      toggleAlarm();
    }
    
    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    const smsPhones = contacts.map(c => c.phone).join(',');
    const locationLink = location.latitude ? \`https://maps.google.com/?q=\${location.latitude},\${location.longitude}\` : 'Unknown location';
    const message = encodeURIComponent(\`EMERGENCY SOS! I need help immediately. Location: \${locationLink}\`);
    
    // Trigger SMS via iframe to avoid consuming the top-level navigation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = \`sms:\${smsPhones}?body=\${message}\`;
    document.body.appendChild(iframe);
    
    // Trigger Phone Call via direct navigation synchronously
    window.location.href = \`tel:\${emergencyNumber}\`;
    
    if (user || localMock) {
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
    
    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };`;

if (app.includes('// Use anchor tags to trigger intents reliably on mobile')) {
    // Let's do a more robust replace that just slices the function out
    const lines = app.split('\\n');
    const startIdx = lines.findIndex(l => l.includes('const activateSOS = async () => {'));
    let endIdx = -1;
    let braceCount = 0;
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('{')) braceCount += (lines[i].match(/\\{/g) || []).length;
        if (lines[i].includes('}')) braceCount -= (lines[i].match(/\\}/g) || []).length;
        if (braceCount === 0 && startIdx !== -1) {
            endIdx = i;
            break;
        }
    }
    
    if (startIdx !== -1 && endIdx !== -1) {
        lines.splice(startIdx, endIdx - startIdx + 1, replacement);
        fs.writeFileSync('src/App.tsx', lines.join('\\n'));
        console.log('Replaced dynamically');
    } else {
        console.log('Could not find function bounds');
    }
} else {
    console.log('Not found');
}
