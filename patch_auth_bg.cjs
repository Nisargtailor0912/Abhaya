const fs = require('fs');
let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const targetBg = `<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background shapes to show off transparency */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/60 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200/60 rounded-full blur-3xl mix-blend-multiply"></div>`;

const newBg = `<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden z-0">
      {/* Light Mode Shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/60 rounded-full blur-3xl mix-blend-multiply dark:hidden"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200/60 rounded-full blur-3xl mix-blend-multiply dark:hidden"></div>
      
      {/* Dark Mode Aurora */}
      <div className="absolute inset-0 overflow-hidden hidden dark:block -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, -150, 100, 0],
            y: [0, 150, -100, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -right-20 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, 100, -150, 0],
            y: [0, -100, 150, 0],
            scale: [1, 1.5, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen" 
        />
      </div>`;

if (content.includes(targetBg)) {
  content = content.replace(targetBg, newBg);
  fs.writeFileSync('src/components/Auth.tsx', content);
  console.log('patched');
} else {
  console.log('not found');
}
