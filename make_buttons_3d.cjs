const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const originalButton = `                <button
                  key={action.id}
                  onClick={() => {
                    if (action.id === 'alarm') toggleAlarm();
                    if (action.id === 'fake-call') triggerFakeCall();
                    if (action.id === 'medical-qr') setShowMedicalQR(true);
                  }}
                  className={\`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all \${
                    isActive 
                      ? 'border-orange-500 bg-orange-50 shadow-sm' 
                      : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-slate-300'
                  }\`}
                >
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center mb-3 \${action.color}\`}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center">{action.title}</span>
                </button>`;

const replacementButton = `                <TiltWrapper key={action.id} maxRotation={5} className="w-full">
                  <button
                    onClick={() => {
                      if (action.id === 'alarm') toggleAlarm();
                      if (action.id === 'fake-call') triggerFakeCall();
                      if (action.id === 'medical-qr') setShowMedicalQR(true);
                    }}
                    style={{ transform: "translateZ(15px)" }}
                    className={\`w-full flex flex-col items-center justify-center p-4 rounded-2xl border transition-all \${
                      isActive 
                        ? 'border-orange-500 bg-orange-50 shadow-[0_8px_16px_rgba(249,115,22,0.2)] scale-105' 
                        : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105'
                    }\`}
                  >
                    <div className={\`w-12 h-12 rounded-full flex items-center justify-center mb-3 \${action.color}\`} style={{ transform: "translateZ(20px)" }}>
                      <action.icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center" style={{ transform: "translateZ(10px)" }}>{action.title}</span>
                  </button>
                </TiltWrapper>`;

content = content.replace(originalButton, replacementButton);

fs.writeFileSync('src/App.tsx', content);
