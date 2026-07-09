const fs = require('fs');
const file = 'src/components/Map.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `{!showSafeRoute && <MapUpdater center={mapCenter} />}`;
const new1 = `<MapUpdater center={mapCenter} />`;

content = content.replace(target1, new1);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed MapUpdater condition');
