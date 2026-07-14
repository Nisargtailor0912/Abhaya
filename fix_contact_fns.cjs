const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const fns = `
  const moveContact = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newContacts = [...contacts];
      [newContacts[index - 1], newContacts[index]] = [newContacts[index], newContacts[index - 1]];
      setContacts(newContacts);
      saveUserData({ contacts: newContacts });
    } else if (direction === 'down' && index < contacts.length - 1) {
      const newContacts = [...contacts];
      [newContacts[index + 1], newContacts[index]] = [newContacts[index], newContacts[index + 1]];
      setContacts(newContacts);
      saveUserData({ contacts: newContacts });
    }
  };

  const deleteContact = (id: string) => {
    const newContacts = contacts.filter(c => c.id !== id);
    setContacts(newContacts);
    saveUserData({ contacts: newContacts });
  };
`;

content = content.replace(
  "  const addHistoryEvent = (type: 'SOS'",
  fns + "\n  const addHistoryEvent = (type: 'SOS'"
);

fs.writeFileSync('src/App.tsx', content);
