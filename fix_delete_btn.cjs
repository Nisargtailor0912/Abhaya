const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '                  <a href={`tel:${contact.phone}`} target="_top" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0">\n                    <Phone size={18} />\n                  </a>\n                </div>',
  `                  <div className="flex items-center gap-2">
                    <a href={\`tel:\${contact.phone}\`} target="_top" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0">
                      <Phone size={18} />
                    </a>
                    <button onClick={() => deleteContact(contact.id)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                </div>`
);

fs.writeFileSync('src/App.tsx', content);
