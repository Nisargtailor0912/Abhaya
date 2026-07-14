const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '                  <button\n                    onClick={() => {\n                      if (action.id === \'alarm\') toggleAlarm();\n                      if (action.id === \'fake-call\') triggerFakeCall();\n                      if (action.id === \'medical-qr\') setShowMedicalQR(true);\n                    }}',
  '                  <button\n                    key={action.id}\n                    onClick={() => {\n                      if (action.id === \'alarm\') toggleAlarm();\n                      if (action.id === \'fake-call\') triggerFakeCall();\n                      if (action.id === \'medical-qr\') setShowMedicalQR(true);\n                    }}'
);

fs.writeFileSync('src/App.tsx', content);
