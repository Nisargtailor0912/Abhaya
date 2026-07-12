const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert after:
//  if (!user) {
//    return <Auth onAuth={() => {}} theme={settings.theme} onThemeChange={(t: any) => setSettings(prev => ({...prev, theme: t}))} />;
//  }

content = content.replace(
  `  if (!user) {
    return <Auth onAuth={() => {}} theme={settings.theme} onThemeChange={(t: any) => setSettings(prev => ({...prev, theme: t}))} />;
  }`,
  `  if (!user) {
    return <Auth onAuth={() => {}} theme={settings.theme} onThemeChange={(t: any) => setSettings(prev => ({...prev, theme: t}))} />;
  }

  if (!user.emailVerified && user?.email?.toLowerCase() !== 'abhaya@abhaya.com') {
    return <VerifyEmail user={user} />;
  }`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx for email verification');
