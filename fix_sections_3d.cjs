const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The first section was replaced correctly, let's fix the others.
content = content.replace(
  /        \{\/\* Live Location Map \*\/}\n        <section>/g,
  '        {/* Live Location Map */}\n        <section style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>'
);
content = content.replace(
  /        \{\/\* Trusted Contacts \*\/}\n        <section>/g,
  '        {/* Trusted Contacts */}\n        <section style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>'
);
content = content.replace(
  /        \{\/\* Features Grid \*\/}\n        <section className="grid grid-cols-2/g,
  '        {/* Features Grid */}\n        <section className="grid grid-cols-2" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}'
);
content = content.replace(
  /<section className="flex flex-col items-center justify-center py-8">/g,
  '<section className="flex flex-col items-center justify-center py-8" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>'
);

fs.writeFileSync('src/App.tsx', content);
