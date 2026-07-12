const fs = require('fs');

const filesToPatch = [
  'src/components/Map.tsx',
  'src/components/AdminPortal.tsx',
  'src/components/MedicalInfoView.tsx'
];

for (const file of filesToPatch) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    `const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';`,
    `const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';`
  );
  
  // also handle the one in Map.tsx which might be multi-line
  content = content.replace(
    /const API_KEY =\s*process\.env\.GOOGLE_MAPS_PLATFORM_KEY \|\|\s*\(import\.meta as any\)\.env\?\.VITE_GOOGLE_MAPS_PLATFORM_KEY \|\|\s*\(globalThis as any\)\.GOOGLE_MAPS_PLATFORM_KEY \|\|\s*'';/g,
    `const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';`
  );
  fs.writeFileSync(file, content);
}
console.log('Patched keys in components');
