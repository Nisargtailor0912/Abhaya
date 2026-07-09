const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace('LocateFixed\n}', 'LocateFixed,\n  Moon,\n  Sun\n}');
content = content.replace("import { Bot } from 'lucide-react';", "import { Bot } from 'lucide-react';\nimport { useTheme } from './useTheme';");
fs.writeFileSync('src/App.tsx', content);
