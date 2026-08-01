const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = 'useEffect(() => {';
const newCode = `  // Handle URL Actions (from PWA shortcuts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'sos' && !sosActive) {
       handleSOSClick();
       // Clear URL
       window.history.replaceState({}, document.title, window.location.pathname);
    } else if (action === 'fakecall' && !fakeCallActive) {
       triggerFakeCall();
       // Clear URL
       window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  useEffect(() => {`;

if (!app.includes("action === 'sos'")) {
    app = app.replace(anchor, newCode);
    fs.writeFileSync('src/App.tsx', app);
}
