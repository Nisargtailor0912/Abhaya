const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const s = {...settings, theme: 'light'};",
  "const s: UserSettings = {...settings, theme: 'light'};"
);
content = content.replace(
  "const s = {...settings, theme: 'dark'};",
  "const s: UserSettings = {...settings, theme: 'dark'};"
);
content = content.replace(
  "const s = {...settings, theme: 'system'};",
  "const s: UserSettings = {...settings, theme: 'system'};"
);

fs.writeFileSync('src/App.tsx', content);
