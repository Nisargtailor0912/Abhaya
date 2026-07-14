
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleMapsKey = env.GOOGLE_MAPS_PLATFORM_KEY || env.GOOGLE_MAPS_API_KEY || env.VITE_GOOGLE_MAPS_PLATFORM_KEY || env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  return {
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(googleMapsKey)
    },
    server: { hmr: false },
    plugins: [
      react(),
      tailwindcss(),
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
          icons: [
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
          ]
        }
      })
    ]
  };
});
