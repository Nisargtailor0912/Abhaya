const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                      </Sun
  Activity,
  RefreshCw,
  CheckCircle2 size={20} className="text-slate-600 dark:text-slate-300" />`;
const replaceStr = `                      <Sun size={20} className="text-slate-600 dark:text-slate-300" />`;

app = app.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', app);
