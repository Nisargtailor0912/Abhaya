const fs = require('fs');
const file = 'src/components/Map.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  useEffect(() => {
    if (sosActive && location.latitude && location.longitude && !showSafeRoute) {
      handleToggleRoute();
    } else if (!sosActive && showSafeRoute) {
      handleToggleRoute(); // turn it off if sos is deactivated
    }
  }, [sosActive, location.latitude, location.longitude]);`;

const new1 = `  useEffect(() => {
    if (sosActive && location.latitude && location.longitude && !showSafeRoute) {
      handleToggleRoute();
    } else if (!sosActive && showSafeRoute) {
      handleToggleRoute(); // turn it off if sos is deactivated
    }
  }, [sosActive, location.latitude, location.longitude, showSafeRoute]);`;

if (content.includes(target1)) {
  content = content.replace(target1, new1);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed useEffect dependencies');
} else {
  console.log('Could not find target1');
}
