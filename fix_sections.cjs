const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<section className="flex flex-col items-center justify-center py-8">',
  '<TiltWrapper className="w-full">\n<section className="flex flex-col items-center justify-center py-8 transform-gpu preserve-3d">'
);

content = content.replace(
  '        {/* Status Bar */}        {(sosActive || alarmActive || location.latitude || location.error) && (           <div className="bg-white/40',
  '        {/* Status Bar */}\n        {(sosActive || alarmActive || location.latitude || location.error) && (\n<TiltWrapper>\n           <div className="bg-white/40'
);

content = content.replace(
  '              </div>           </div>        )}',
  '              </div>           </div>\n</TiltWrapper>\n        )}'
);

content = content.replace(
  '        {/* Map Section */}        <section className="bg-white/40',
  '        {/* Map Section */}\n<TiltWrapper>\n        <section className="bg-white/40'
);

content = content.replace(
  '        </section>        <section>          <div className="flex items-center justify-between mb-4 px-1">',
  '        </section>\n</TiltWrapper>\n        <TiltWrapper>\n<section>\n          <div className="flex items-center justify-between mb-4 px-1">'
);

content = content.replace(
  '            )}          </div>        </section>        {/* Safety Tips */}        <section className="bg-blue-50',
  '            )}          </div>        </section>\n</TiltWrapper>\n        {/* Safety Tips */}\n        <TiltWrapper>\n<section className="bg-blue-50'
);

content = content.replace(
  '            </ul>          </div>        </section>      </main>',
  '            </ul>          </div>        </section>\n</TiltWrapper>\n      </main>'
);

fs.writeFileSync('src/App.tsx', content);
