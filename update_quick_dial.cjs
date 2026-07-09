const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetButton = `<button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Phone size={18} />
                  </button>`;

const replacementButton = `<a href={\`tel:\${contact.phone}\`} className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Phone size={18} />
                  </a>`;

if (content.includes(targetButton)) {
    content = content.replace(targetButton, replacementButton);
    fs.writeFileSync('src/App.tsx', content, 'utf8');
    console.log('Successfully updated quick dial button.');
} else {
    console.log('Could not find target button to replace.');
}
