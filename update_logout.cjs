const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const logoutFn = `const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch(err) {}
    localStorage.removeItem("localMockAuth");
    setLocalMock(false);
    setUser(null);
    setShowSettings(false);
    setShowProfile(false);
  };`;

// Insert it somewhere at the top of the component
content = content.replace(
  '  const toggleSetting = (key: keyof UserSettings) => {',
  logoutFn + '\n\n  const toggleSetting = (key: keyof UserSettings) => {'
);

content = content.replace(
  'onClick={() => { setShowSettings(false); localStorage.removeItem("localMockAuth"); setLocalMock(false); setUser(null); signOut(auth).catch(()=>{}).finally(() => window.location.reload()); }}',
  'onClick={handleLogout}'
);

content = content.replace(
  'onClick={() => { setShowProfile(false); localStorage.removeItem("localMockAuth"); setLocalMock(false); setUser(null); signOut(auth).catch(()=>{}).finally(() => window.location.reload()); }}',
  'onClick={handleLogout}'
);

fs.writeFileSync('src/App.tsx', content);
