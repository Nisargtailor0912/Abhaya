const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// import SlideToSOS
if (!content.includes('SlideToSOS')) {
  content = content.replace(
    "import SlideToAnswer from './components/SlideToAnswer';",
    "import SlideToAnswer from './components/SlideToAnswer';\nimport SlideToSOS from './components/SlideToSOS';"
  );
}

// Replace SOS section
const oldSOSSectionStart = content.indexOf('<section className="flex flex-col items-center justify-center py-8">');
const oldSOSSectionEnd = content.indexOf('</section>', oldSOSSectionStart) + '</section>'.length;

if (oldSOSSectionStart !== -1) {
  const newSOSSection = `<section className="flex flex-col items-center justify-center py-8">
          <div className="relative w-full flex justify-center">
            {/* Ripple effect when active */}
            {sosActive && !settings.lowPowerMode && (
              <motion.div
                className="absolute inset-0 bg-rose-500 rounded-full"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            <SlideToSOS 
              active={sosActive} 
              countdown={countdown} 
              onTrigger={handleSOSClick} 
              onCancel={handleSOSClick} 
            />
          </div>
          <p className="mt-8 text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs font-medium">
            {sosActive 
              ? 'Emergency contacts and local authorities have been notified of your location.'
              : 'Use in case of emergency. This will alert your trusted contacts and share your live location.'}
          </p>
        </section>`;

  content = content.substring(0, oldSOSSectionStart) + newSOSSection + content.substring(oldSOSSectionEnd);
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx SOS section updated');
} else {
  console.log('SOS section not found');
}
