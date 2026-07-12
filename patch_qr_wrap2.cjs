const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldQr = '<QRCode \n' +
'                    value={`https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${btoa(encodeURIComponent(JSON.stringify({\n' +
'                      name: personalInfo.fullName,\n' +
'                      phone: personalInfo.phone,\n' +
'                      blood: personalInfo.bloodGroup,\n' +
'                      conditions: personalInfo.medicalConditions,\n' +
'                      note: personalInfo.emergencyNote\n' +
'                    })))}`}\n' +
'                    onClick={() => {\n' +
'                      const url = `https://ais-pre-kvi7qwysow2ue3pe6is2n4-422275091489.asia-southeast1.run.app/?medicalData=${btoa(encodeURIComponent(JSON.stringify({\n' +
'                        name: personalInfo.fullName,\n' +
'                        phone: personalInfo.phone,\n' +
'                        blood: personalInfo.bloodGroup,\n' +
'                        conditions: personalInfo.medicalConditions,\n' +
'                        note: personalInfo.emergencyNote\n' +
'                      })))}`;\n' +
'                      window.open(url, "_blank", "noopener,noreferrer");\n' +
'                    }}\n' +
'                    className="cursor-pointer" \n' +
'                    size={200}\n' +
'                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}\n' +
'                  />';

const newQr = `
                <a 
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
                </a>
`;

if (appContent.includes(oldQr)) {
  appContent = appContent.replace(oldQr, newQr);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Wrapped QR in anchor tag successfully (v2).");
} else {
  console.log("Couldn't find the QR code block to wrap (v2).");
}
