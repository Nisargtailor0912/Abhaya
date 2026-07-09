const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8"
      >`;

const replace1 = `    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background shapes to show off transparency */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/60 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200/60 rounded-full blur-3xl mix-blend-multiply"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl overflow-hidden p-8 relative z-10"
      >`;

content = content.replace(target1, replace1);

const targetInput = `className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"`;
const replaceInput = `className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-sm"`;
// Handle multiple inputs
content = content.split(targetInput).join(replaceInput);

const targetGoogle = `className="w-full bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl py-3 mt-4 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"`;
const replaceGoogle = `className="w-full bg-white/50 backdrop-blur-sm border border-white/50 text-slate-700 font-semibold rounded-xl py-3 mt-4 hover:bg-white/70 transition-colors flex items-center justify-center gap-2"`;
content = content.replace(targetGoogle, replaceGoogle);

fs.writeFileSync(file, content, 'utf8');
console.log('Made Auth.tsx transparent!');
