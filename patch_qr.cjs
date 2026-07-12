const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `value={JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    })}`;

const newCode = `value={\`\${window.location.origin}?medicalData=\${btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    })))}\`}`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('src/App.tsx', content);
  console.log('QR Code patched');
} else {
  console.log('Could not find exact code to replace');
}
