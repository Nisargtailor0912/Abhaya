const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  '<div className="p-5 overflow-y-auto space-y-6">\n                <div>\n                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">',
  '<div className="p-5 overflow-y-auto space-y-6">\n                <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">\n                  Adding the app to your home screen allows you to bypass the browser and trigger SOS faster during emergencies.\n                </p>\n                <div>\n                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">'
);

fs.writeFileSync('src/App.tsx', app);
