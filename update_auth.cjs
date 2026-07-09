const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8"
      >`;

const replacement = `    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Aesthetic background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden p-8 relative z-10"
      >`;

content = content.replace(target, replacement);

const targetInput1 = `className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"`;
const replacementInput1 = `className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/80 transition-colors backdrop-blur-sm"`;

content = content.replace(new RegExp(targetInput1, 'g'), replacementInput1);

const targetBtn = `className="w-full bg-rose-600 text-white font-semibold rounded-xl py-3 hover:bg-rose-700 transition-colors disabled:opacity-50 mt-4"`;
const replacementBtn = `className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl py-3 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50 mt-4"`;

content = content.replace(targetBtn, replacementBtn);

const targetGoogle = `className="w-full bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl py-3 mt-4 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"`;
const replacementGoogle = `className="w-full bg-white/60 backdrop-blur-sm border border-white/60 text-slate-700 font-semibold rounded-xl py-3 mt-4 hover:bg-white/80 shadow-sm transition-all flex items-center justify-center gap-2"`;

content = content.replace(targetGoogle, replacementGoogle);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated Auth.tsx');
