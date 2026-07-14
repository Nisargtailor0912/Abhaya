const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const moveContactCode = `
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
`;

content = content.replace(
  'const deleteContact = (id: string) => {',
  `${moveContactCode}\n  const deleteContact = (id: string) => {`
);

fs.writeFileSync('src/App.tsx', content);
