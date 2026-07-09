const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `             {location.error && (
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-slate-900">Location Error</p>
                   <p className="text-xs text-rose-600 font-medium">{location.error}</p>
                 </div>
               </div>
             )}`;

const newStr = `             {location.error && (
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-slate-900">Location Error</p>
                   <p className="text-xs text-rose-600 font-medium">{location.error}</p>
                 </div>
                 <button 
                   onClick={() => {
                     const lat = prompt("Enter manual latitude (e.g., 20.5937):");
                     const lng = prompt("Enter manual longitude (e.g., 78.9629):");
                     if (lat && lng) {
                       setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lng), error: null });
                     }
                   }}
                   className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors shrink-0"
                 >
                   Manual Location
                 </button>
               </div>
             )}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Added Manual Location button.");
} else {
    console.log("Could not find the target location error block.");
}
