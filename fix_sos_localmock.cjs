const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Fix activateSOS
app = app.replace(
    'if (user) {\n      try {\n        if (localMock) return;',
    'if (user || localMock) {\n      try {'
);

app = app.replace(
    /userId: user\.uid,\s*userName: personalInfo\.fullName \|\| user\.displayName \|\| 'Unknown User',\s*userEmail: user\.email,/,
    "userId: user?.uid || 'guest-user',\n          userName: personalInfo.fullName || user?.displayName || 'Guest User',\n          userEmail: user?.email || 'guest@local',"
);

// Fix sync location
app = app.replace(
    'if (sosActive && currentEmergencyId && location.latitude && location.longitude) {\n      if (localMock) return;',
    'if (sosActive && currentEmergencyId && location.latitude && location.longitude) {'
);

// Fix handleSOSClick
app = app.replace(
    'if (currentEmergencyId) {\n        try {\n          if (localMock) return;',
    'if (currentEmergencyId) {\n        try {'
);

fs.writeFileSync('src/App.tsx', app);
