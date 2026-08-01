const fs = require('fs');
let vite = fs.readFileSync('vite.config.ts', 'utf8');

const shortcutsStr = `,
          shortcuts: [
            {
              name: 'Activate SOS',
              short_name: 'SOS',
              description: 'Trigger emergency SOS immediately',
              url: '/?action=sos',
              icons: [{ src: 'https://cdn-icons-png.flaticon.com/512/3204/3204018.png', sizes: '192x192' }]
            },
            {
              name: 'Fake Call',
              short_name: 'Fake Call',
              description: 'Trigger a fake incoming call',
              url: '/?action=fakecall',
              icons: [{ src: 'https://cdn-icons-png.flaticon.com/512/3204/3204018.png', sizes: '192x192' }]
            }
          ]
        }`;

vite = vite.replace('          ]\n        }', '          ]' + shortcutsStr);
fs.writeFileSync('vite.config.ts', vite);
