const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// import SlideToAnswer
if (!content.includes('SlideToAnswer')) {
  content = content.replace(
    "import Auth from './components/Auth';",
    "import Auth from './components/Auth';\nimport SlideToAnswer from './components/SlideToAnswer';"
  );
}

// replace Fake Call Overlay
const oldOverlayStart = content.indexOf('{/* Fake Call Overlay Simulation */}');
const oldOverlayEnd = content.indexOf('{/* Safety Bot */}');

if (oldOverlayStart !== -1 && oldOverlayEnd !== -1) {
  const newOverlay = `{/* Fake Call Overlay Simulation */}
      <AnimatePresence>
        {fakeCallActive && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-3xl flex flex-col items-center justify-between pb-16 pt-24"
          >
            {/* iOS Glass Background Blob */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
               <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="text-center">
              {fakeCallState === 'incoming' ? (
                <p className="text-white/60 text-xl mb-2 font-light">incoming call...</p>
              ) : (
                <p className="text-emerald-400 text-xl mb-2 font-medium">00:{fakeCallTime.toString().padStart(2, '0')}</p>
              )}
              <h2 className="text-white text-5xl font-light tracking-wide mt-2">Dad</h2>
              <p className="text-white/50 text-lg mt-2">Mobile</p>
            </div>
            
            <div className="w-full px-8 pb-12 flex flex-col items-center justify-end">
              {fakeCallState === 'incoming' ? (
                <div className="w-full flex flex-col items-center gap-8">
                   <div className="flex w-full max-w-sm justify-between px-6 mb-8">
                     <div className="flex flex-col items-center gap-2">
                       <button onClick={endFakeCall} className="w-16 h-16 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white hover:shadow-glow-rose transition-all">
                         <Phone size={28} className="rotate-[135deg]" />
                       </button>
                       <span className="text-white/70 text-sm">Decline</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 opacity-0">
                       {/* Placeholder to balance the layout if we needed two buttons, but we only have decline and slider */}
                     </div>
                   </div>
                   
                   <SlideToAnswer onAccept={acceptFakeCall} />
                </div>
              ) : (
                <button 
                  onClick={endFakeCall}
                  className="w-[72px] h-[72px] rounded-full bg-rose-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-glow-rose transition-all mt-auto"
                >
                  <Phone size={36} className="rotate-[135deg]" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      `;
  
  content = content.substring(0, oldOverlayStart) + newOverlay + content.substring(oldOverlayEnd);
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx Fake Call overlay updated');
} else {
  console.log('Fake Call Overlay block not found');
}
