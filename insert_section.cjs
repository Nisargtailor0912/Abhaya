const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

const injectionPoint = '{/* Quick Actions */}';
const newSection = `
        {/* System Security */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-semibold text-slate-800">System Security</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Antivirus Protection Active</p>
                <p className="text-xs text-slate-500 mt-0.5">Real-time device monitoring is active. No threats detected.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">E2E Encryption</p>
                <p className="text-xs text-slate-500 mt-0.5">Your emergency contacts and location data are end-to-end encrypted.</p>
              </div>
            </div>
          </div>
        </section>

        `;

if (content.includes(injectionPoint)) {
  const newContent = content.replace(injectionPoint, newSection + injectionPoint);
  fs.writeFileSync('src/App.tsx', newContent, 'utf8');
  console.log('Successfully injected security section.');
} else {
  console.error('Injection point not found.');
}
