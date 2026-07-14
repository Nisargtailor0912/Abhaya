const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'onClick={() => { setShowSettings(false); signOut(auth).then(() => window.location.reload()); }}',
  'onClick={() => { setShowSettings(false); localStorage.removeItem("localMockAuth"); setLocalMock(false); setUser(null); signOut(auth).catch(()=>{}).finally(() => window.location.reload()); }}'
);

content = content.replace(
  'onClick={() => { setShowProfile(false); signOut(auth).then(() => window.location.reload()); }}',
  'onClick={() => { setShowProfile(false); localStorage.removeItem("localMockAuth"); setLocalMock(false); setUser(null); signOut(auth).catch(()=>{}).finally(() => window.location.reload()); }}'
);

fs.writeFileSync('src/App.tsx', content);
