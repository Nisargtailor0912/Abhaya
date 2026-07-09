const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `        {(sosActive || alarmActive || location.latitude) && (
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
             {location.latitude && location.longitude && (
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1 truncate">
                   <p className="font-medium text-slate-900">Location Active</p>
                   <p className="truncate text-xs opacity-80">Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
                 </div>
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Tracking</span>
               </div>
             )}`;

const newStr = `        {(sosActive || alarmActive || location.latitude || location.error) && (
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
             {location.error && (
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-slate-900">Location Error</p>
                   <p className="text-xs text-rose-600 font-medium">{location.error}</p>
                 </div>
               </div>
             )}
             {!location.error && location.latitude && location.longitude && (
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1 truncate">
                   <p className="font-medium text-slate-900">Location Active</p>
                   <p className="truncate text-xs opacity-80">Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
                 </div>
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Tracking</span>
               </div>
             )}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Added location error to status bar.");
} else {
    console.log("Could not find the target location status block.");
}
