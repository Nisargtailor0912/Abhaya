const fs = require('fs');

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetFunction = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    if (user) {
      try {
        const emgRef = await addDoc(collection(db, 'emergencies'), {
          userId: user.uid,
          userName: personalInfo.fullName || user.displayName || 'Unknown User',
          userEmail: user.email,
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
      } catch (err) {
        console.error("Error creating emergency record:", err);
      }
    }

    // Simulate Offline SMS notification if enabled and network is down (mocking offline state)
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };`;

const newFunction = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    if (user) {
      try {
        const emgRef = await addDoc(collection(db, 'emergencies'), {
          userId: user.uid,
          userName: personalInfo.fullName || user.displayName || 'Unknown User',
          userEmail: user.email,
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
      } catch (err) {
        console.error("Error creating emergency record:", err);
      }
    }

    // Automatically call emergency number
    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    window.location.href = \`tel:\${emergencyNumber}\`;

    // Simulate SMS alerts
    setTimeout(() => {
      const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
      alert(\`EMERGENCY ALERTS DISPATCHED!\\n\\nAutomated SMS sent with your live location to:\\n- Local Police Station (100)\\n- Cyber Cell (1930)\\n- Trusted Contacts: \${contactNames}\\n\\nA secure call log has been created in the Admin Portal.\`);
    }, 1000);

    // Play alert ringtone automatically
    if (!alarmActive) {
      toggleAlarm();
    }

    // Simulate Offline SMS notification if enabled and network is down (mocking offline state)
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };`;

if (content.includes(targetFunction)) {
  content = content.replace(targetFunction, newFunction);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Successfully updated activateSOS");
} else {
  console.log("Could not find activateSOS");
}
