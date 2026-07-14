const fs = require('fs');
let viteContent = fs.readFileSync('vite.config.ts', 'utf8');

viteContent = viteContent.replace(
  'icons: []',
  `icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3204/3204018.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3204/3204018.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]`
);

fs.writeFileSync('vite.config.ts', viteContent);
