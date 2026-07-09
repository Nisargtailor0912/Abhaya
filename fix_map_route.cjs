const fs = require('fs');
const file = 'src/components/Map.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('google.maps.TravelMode.WALKING', 'google.maps.TravelMode.DRIVING');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed travel mode');
