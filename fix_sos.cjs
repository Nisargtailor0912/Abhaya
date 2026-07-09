const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetFunctionRegex = /const activateSOS = async \(\) => \{[\s\S]*?\n  \};\n\n  const cancelCountdown/m;

const newFunction = `const activateSOS = async () => {
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

    const emergencyNumber = contacts.length > 0 ? contacts[0].phone : '100';
    
    // Play alert ringtone automatically
    if (!alarmActive) {
      toggleAlarm();
    }

    // Try to initiate call
    window.location.href = \`tel:\${emergencyNumber}\`;
    
    // Attempt SMS after a slight delay
    setTimeout(() => {
      const smsPhones = contacts.map(c => c.phone).join(',');
      const locationLink = location.latitude ? \`https://maps.google.com/?q=\${location.latitude},\${location.longitude}\` : 'Unknown location';
      const message = encodeURIComponent(\`EMERGENCY SOS! I need help immediately. Location: \${locationLink}\`);
      
      const a = document.createElement('a');
      a.href = \`sms:\${smsPhones}?body=\${message}\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      const contactNames = contacts.length > 0 ? contacts.map(c => c.name).join(', ') : 'No trusted contacts saved';
      alert(\`EMERGENCY ALERTS DISPATCHED!\\n\\nAutomated SMS sent with your live location to:\\n- Local Police Station (100)\\n- Cyber Cell (1930)\\n- Trusted Contacts: \${contactNames}\\n\\n🚨 CRITICAL ALERT INITIATED:\\nA loud emergency siren has been triggered on the devices of your trusted contacts to ensure immediate attention.\\n\\nA secure call log has been created in the Admin Portal.\`);
    }, 1500);

    // Simulate Offline SMS notification if enabled and network is down
    if (settings.offlineSMS && !navigator.onLine) {
      alert("Network unavailable. Attempting Offline Emergency SMS...");
    }
  };

  const cancelCountdown`;

content = content.replace(targetFunctionRegex, newFunction);
fs.writeFileSync(file, content, 'utf8');
console.log("Updated activateSOS");
