const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetFunction = `  const handleSOSClick = async () => {
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
      setCountdown(3);
    }
  };`;

const newFunction = `  const handleSOSClick = async () => {
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
      setCountdown(3);
    }
  };`;

if(content.includes(targetFunction)) {
  content = content.replace(targetFunction, newFunction);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed handleSOSClick');
} else {
  console.log('Could not find handleSOSClick');
}
