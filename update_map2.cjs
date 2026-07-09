const fs = require('fs');
const file = 'src/components/Map.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));`;
const new1 = `setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map, 
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#10b981',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));`;

content = content.replace(target1, new1);

const target2 = `      {location.latitude && location.longitude && (
        <button 
          onClick={handleToggleRoute}
          className="absolute z-10 top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Navigation size={16} className={showSafeRoute ? "text-emerald-500" : "text-blue-500"} />
          {showSafeRoute ? 'Clear Route' : 'Get Safe Route'}
        </button>
      )}`;
const new2 = `      {location.latitude && location.longitude && (
        <div className="absolute z-10 top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={handleToggleRoute}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Navigation size={16} className={showSafeRoute ? "text-emerald-500" : "text-blue-500"} />
            {showSafeRoute ? 'Clear Route' : 'Get Safe Route'}
          </button>
          <button 
            onClick={() => setMapCenter({lat: location.latitude!, lng: location.longitude!})}
            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-fit ml-auto"
          >
            <Navigation size={16} className="text-slate-500" />
            Recenter
          </button>
        </div>
      )}`;

content = content.replace(target2, new2);
fs.writeFileSync(file, content, 'utf8');
console.log('Updated Map.tsx');
