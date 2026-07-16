const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { Download, motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';");

if (!app.includes('Download,')) {
    app = app.replace("import {\n  ShieldAlert,", "import {\n  Download,\n  ShieldAlert,");
}
fs.writeFileSync('src/App.tsx', app);
