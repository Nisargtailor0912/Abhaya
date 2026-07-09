const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace('  const [settings, setSettings] = useState<UserSettings>(defaultSettings);', '  const [settings, setSettings] = useState<UserSettings>(defaultSettings);\n  useTheme(settings.theme);');
fs.writeFileSync('src/App.tsx', content);
