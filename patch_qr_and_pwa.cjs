const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldQrVal = 'value={`${window.location.origin}?medicalData=${btoa(encodeURIComponent(JSON.stringify({\n' +
'                      name: personalInfo.fullName,\n' +
'                      phone: personalInfo.phone,\n' +
'                      blood: personalInfo.bloodGroup,\n' +
'                      conditions: personalInfo.medicalConditions,\n' +
'                      note: personalInfo.emergencyNote\n' +
'                    })))}`}';

const newQrVal = 'value={`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${btoa(encodeURIComponent(JSON.stringify({\n' +
'                      name: personalInfo.fullName,\n' +
'                      phone: personalInfo.phone,\n' +
'                      blood: personalInfo.bloodGroup,\n' +
'                      conditions: personalInfo.medicalConditions,\n' +
'                      note: personalInfo.emergencyNote\n' +
'                    })))}`}\n' +
'                    onClick={() => {\n' +
'                      const url = `https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${btoa(encodeURIComponent(JSON.stringify({\n' +
'                        name: personalInfo.fullName,\n' +
'                        phone: personalInfo.phone,\n' +
'                        blood: personalInfo.bloodGroup,\n' +
'                        conditions: personalInfo.medicalConditions,\n' +
'                        note: personalInfo.emergencyNote\n' +
'                      })))}`;\n' +
'                      window.open(url, "_blank", "noopener,noreferrer");\n' +
'                    }}\n' +
'                    className="cursor-pointer"';

appContent = appContent.replace(oldQrVal, newQrVal);
fs.writeFileSync('src/App.tsx', appContent);

// Patch Vite Config for PWA
const viteConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Abhaya Safety App',
        short_name: 'Abhaya',
        description: 'Women Safety Alert App',
        theme_color: '#ffffff',
        icons: []
      }
    })
  ]
});
`;
fs.writeFileSync('vite.config.ts', viteConfigContent);

console.log('Patched App.tsx and vite.config.ts');
