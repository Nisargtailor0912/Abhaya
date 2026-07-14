const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We already wrapped some sections. Let's undo those and apply global 3D + local 3D.
content = content.replace(/<TiltWrapper.*?>/g, '');
content = content.replace(/<\/TiltWrapper>/g, '');

content = content.replace(
  '<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative overflow-hidden z-0">',
  '<TiltWrapper maxRotation={3} className="min-h-screen w-full">\n<div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-white pb-20 md:pb-0 relative overflow-hidden z-0" style={{ transformStyle: "preserve-3d" }}>'
);

content = content.replace(
  '        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">',
  '        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none" style={{ transform: "translateZ(-100px)" }}>'
);

content = content.replace(
  '      <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">',
  '      <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>'
);

content = content.replace(
  '      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">',
  '      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8" style={{ transformStyle: "preserve-3d" }}>'
);

content = content.replace(
  '<section className="flex flex-col items-center justify-center py-8 transform-gpu preserve-3d">',
  '<section className="flex flex-col items-center justify-center py-8" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>'
);

content = content.replace(
  '           <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 transition-all duration-300 flex flex-col gap-3">',
  '           <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 transition-all duration-300 flex flex-col gap-3" style={{ transform: "translateZ(40px)" }}>'
);

content = content.replace(
  '        <section>',
  '        <section style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>'
);
content = content.replace(
  '        <section>',
  '        <section style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>'
);
content = content.replace(
  '        <section className="bg-blue-50 rounded-2xl p-5 border border-blue-100">',
  '        <section className="bg-blue-50 rounded-2xl p-5 border border-blue-100" style={{ transform: "translateZ(40px)" }}>'
);

content = content.replace(
  '      <footer className="text-center py-6 text-slate-400 text-xs">',
  '      <footer className="text-center py-6 text-slate-400 text-xs" style={{ transform: "translateZ(10px)" }}>'
);

content = content.replace(
  '      <AnimatePresence>',
  '    </div>\n</TiltWrapper>\n      <AnimatePresence>'
);

fs.writeFileSync('src/App.tsx', content);
