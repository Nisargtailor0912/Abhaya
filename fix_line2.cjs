const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import e } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';");
fs.writeFileSync('src/App.tsx', app);
