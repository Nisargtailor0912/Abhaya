const fs = require('fs');
let fileAdmin = 'src/components/AdminPortal.tsx';
let contentAdmin = fs.readFileSync(fileAdmin, 'utf8');

const targetStr = `{hasValidKey ? (
            
          {selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude && (
            <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setRecenterTrigger(prev => prev + 1)}
                className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
              >
                <MapPin size={16} className="text-slate-500" />
                Recenter
              </button>
            </div>
          )}
          <APIProvider apiKey={API_KEY} version="weekly">`;

const newStr = `{hasValidKey ? (
            <>
          {selectedEmergency && selectedEmergency.location.latitude && selectedEmergency.location.longitude && (
            <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setRecenterTrigger(prev => prev + 1)}
                className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
              >
                <MapPin size={16} className="text-slate-500" />
                Recenter
              </button>
            </div>
          )}
          <APIProvider apiKey={API_KEY} version="weekly">`;

contentAdmin = contentAdmin.replace(targetStr, newStr);

const targetStrEnd = `</APIProvider>
          ) : (`;

const newStrEnd = `</APIProvider>
          </>
          ) : (`;

contentAdmin = contentAdmin.replace(targetStrEnd, newStrEnd);

fs.writeFileSync(fileAdmin, contentAdmin, 'utf8');
