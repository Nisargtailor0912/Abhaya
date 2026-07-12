const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldQrBlock = `                <a 
                  href={\`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=\${btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    })))}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                >
                  <QRCode 
                    value={\`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=\${btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    })))}\`} 
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </a>`;

const newQrBlock = `                <a 
                  href={\`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=\${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    }))))}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                >
                  <QRCode 
                    value={\`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=\${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
                      name: personalInfo.fullName,
                      phone: personalInfo.phone,
                      blood: personalInfo.bloodGroup,
                      conditions: personalInfo.medicalConditions,
                      note: personalInfo.emergencyNote
                    }))))}\`} 
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </a>`;

if (appContent.includes(oldQrBlock)) {
  appContent = appContent.replace(oldQrBlock, newQrBlock);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Fixed QR code encoding in App.tsx");
} else {
  console.log("Could not find QR block in App.tsx");
}
