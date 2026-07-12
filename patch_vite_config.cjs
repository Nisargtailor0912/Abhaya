const fs = require('fs');

let configContent = fs.readFileSync('vite.config.ts', 'utf8');

if (!configContent.includes('process.env.GOOGLE_MAPS_PLATFORM_KEY')) {
  configContent = configContent.replace(
    'plugins: [',
    `define: {\n    'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')\n  },\n  plugins: [`
  );
  fs.writeFileSync('vite.config.ts', configContent);
  console.log('Patched vite.config.ts with Google Maps API key define.');
} else {
  console.log('vite.config.ts already has the define.');
}
