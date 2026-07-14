const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

if (!content.includes('import TiltWrapper')) {
  content = "import TiltWrapper from './TiltWrapper';\n" + content;
}

content = content.replace(
  '        <motion.div\n          initial={{ y: \'100%\' }}\n          animate={{ y: 0 }}\n          exit={{ y: \'100%\' }}\n          transition={{ type: "spring", bounce: 0, duration: 0.4 }}\n          className="bg-slate-50 dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden max-h-[90vh] sm:h-[600px] shadow-2xl"\n        >',
  '        <TiltWrapper maxRotation={2} className="w-full max-w-md">\n        <motion.div\n          initial={{ y: \'100%\' }}\n          animate={{ y: 0 }}\n          exit={{ y: \'100%\' }}\n          transition={{ type: "spring", bounce: 0, duration: 0.4 }}\n          className="bg-slate-50 dark:bg-slate-900 w-full rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden max-h-[90vh] sm:h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"\n          style={{ transformStyle: "preserve-3d" }}\n        >'
);

content = content.replace(
  '          {/* Header */}\n          <div className="bg-white dark:bg-slate-800 px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 shadow-sm z-10">',
  '          {/* Header */}\n          <div className="bg-white dark:bg-slate-800 px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 shadow-sm z-10" style={{ transform: "translateZ(30px)" }}>'
);

content = content.replace(
  '        </motion.div>\n      </motion.div>\n    </AnimatePresence>',
  '        </motion.div>\n        </TiltWrapper>\n      </motion.div>\n    </AnimatePresence>'
);

fs.writeFileSync('src/components/SafetyBot.tsx', content);
