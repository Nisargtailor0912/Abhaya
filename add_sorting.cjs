const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = "  Lock\n} from 'lucide-react';";
const newImport = "  Lock,\n  ChevronUp,\n  ChevronDown\n} from 'lucide-react';";
content = content.replace(targetImport, newImport);

const targetAddContact = "  const handleAddContact = async (e: React.FormEvent) => {";
const newMoveContact = `  const moveContact = (index: number, direction: 'up' | 'down') => {
    const newContacts = [...contacts];
    if (direction === 'up' && index > 0) {
      [newContacts[index], newContacts[index - 1]] = [newContacts[index - 1], newContacts[index]];
    } else if (direction === 'down' && index < contacts.length - 1) {
      [newContacts[index], newContacts[index + 1]] = [newContacts[index + 1], newContacts[index]];
    } else {
      return;
    }
    setContacts(newContacts);
    saveUserData({ contacts: newContacts });
  };

  const handleAddContact = async (e: React.FormEvent) => {`;
content = content.replace(targetAddContact, newMoveContact);

const targetContactMap = `              contacts.map((contact, idx) => (
                <div 
                  key={contact.id} 
                  className={\`flex items-center justify-between p-4 \${idx !== contacts.length - 1 ? 'border-b border-slate-100' : ''}\`}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-500">{contact.relation} • {contact.phone}</p>
                  </div>
                  <a href={\`tel:\${contact.phone}\`} className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Phone size={18} />
                  </a>
                </div>
              ))`;
const newContactMap = `              contacts.map((contact, idx) => (
                <div 
                  key={contact.id} 
                  className={\`flex items-center justify-between p-4 \${idx !== contacts.length - 1 ? 'border-b border-slate-100' : ''}\`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={() => moveContact(idx, 'up')}
                        disabled={idx === 0}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={() => moveContact(idx, 'down')}
                        disabled={idx === contacts.length - 1}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{contact.name}</p>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Primary</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{contact.relation} • {contact.phone}</p>
                    </div>
                  </div>
                  <a href={\`tel:\${contact.phone}\`} className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0">
                    <Phone size={18} />
                  </a>
                </div>
              ))`;
content = content.replace(targetContactMap, newContactMap);

fs.writeFileSync('src/App.tsx', content, 'utf8');
