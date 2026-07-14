const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '{(sosActive || alarmActive || location.latitude || location.error) && (\n           <div className="bg-white/40',
  '{(sosActive || alarmActive || location.latitude || location.error) && (\n<TiltWrapper>\n           <div className="bg-white/40'
);

// find the closing tag for the status bar
// it's right before `{/* Map Section */}`
content = content.replace(
  '             </div>\n           </div>\n        )}\n        {/* Map Section */}',
  '             </div>\n           </div>\n</TiltWrapper>\n        )}\n        {/* Map Section */}'
);

fs.writeFileSync('src/App.tsx', content);
