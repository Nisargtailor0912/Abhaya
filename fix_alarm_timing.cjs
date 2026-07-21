const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetMethod = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    if (user || localMock) {
      try {`;

const newMethod = `  const activateSOS = async () => {
    setSosActive(true);
    addHistoryEvent('SOS');
    
    // Play alert ringtone automatically, synchronously before any await
    if (!alarmActive) {
      toggleAlarm();
    }
    
    if (user || localMock) {
      try {`;

const oldAlarmCall = `    // Play alert ringtone automatically
    if (!alarmActive) {
      toggleAlarm();
    }`;

app = app.replace(targetMethod, newMethod);
app = app.replace(oldAlarmCall, ''); // Remove the old one

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed alarm timing');
