const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
const targetState = '  const [showMedicalQR, setShowMedicalQR] = useState(false);';
const newState = '  const [showMedicalQR, setShowMedicalQR] = useState(false);\n  const [showWidgetInfo, setShowWidgetInfo] = useState(false);';
content = content.replace(targetState, newState);

// Add button to profile menu
const targetProfileBtn = `                <button onClick={() => { setShowProfile(false); setShowEmergencyNumbers(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left font-medium">
                  <PhoneCall size={20} className="text-slate-400" />
                  India Emergency Numbers
                </button>`;
const newProfileBtn = `                <button onClick={() => { setShowProfile(false); setShowEmergencyNumbers(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left font-medium">
                  <PhoneCall size={20} className="text-slate-400" />
                  India Emergency Numbers
                </button>
                <button onClick={() => { setShowProfile(false); setShowWidgetInfo(true); }} className="w-full flex items-center gap-3 p-4 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left font-medium">
                  <Smartphone size={20} className="text-slate-400" />
                  Add Panic Widget
                </button>`;
content = content.replace(targetProfileBtn, newProfileBtn);

// Add Widget Modal
const targetModal = `      {/* India Emergency Numbers Modal */}`;
const newModal = `      {/* Widget Info Modal */}
      <AnimatePresence>
        {showWidgetInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">Add Panic Widget</h3>
                <button onClick={() => setShowWidgetInfo(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-700 p-1.5 rounded-lg">🍎</span>
                    iOS (iPhone/iPad)
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 ml-1">
                    <li>Open this app in <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share</strong> button at the bottom (square with an arrow pointing up).</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Open the Shortcuts app and create a new Shortcut.</li>
                    <li>Select "Open App" and choose Vertex.</li>
                    <li>Add the Shortcut widget to your lock screen or home screen for instant access!</li>
                  </ol>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-700 p-1.5 rounded-lg">🤖</span>
                    Android
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 ml-1">
                    <li>Open this app in <strong>Chrome</strong>.</li>
                    <li>Tap the <strong>Menu</strong> icon (3 dots in upper right-hand corner).</li>
                    <li>Tap <strong>"Add to Home screen"</strong>.</li>
                    <li>You can now place the Vertex app icon anywhere on your home screen.</li>
                    <li>Long-press the icon and use <strong>Widgets</strong> to add quick action shortcuts (if supported by your launcher).</li>
                  </ol>
                </div>
                
                <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm mt-4 flex gap-3">
                  <AlertOctagon size={20} className="shrink-0 mt-0.5 text-rose-500" />
                  <p>Adding the app to your home screen allows you to bypass the browser and trigger SOS faster during emergencies.</p>
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100">
                <button 
                  onClick={() => setShowWidgetInfo(false)}
                  className="w-full bg-slate-900 text-white font-semibold rounded-xl py-3 hover:bg-slate-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* India Emergency Numbers Modal */}`;
content = content.replace(targetModal, newModal);

fs.writeFileSync('src/App.tsx', content, 'utf8');
