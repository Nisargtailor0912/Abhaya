const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = "window.location.href = `tel:${emergencyNumber}`;";
const newStr = `
    const a = document.createElement('a');
    a.href = \`tel:\${emergencyNumber}\`;
    a.target = '_top';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Updated call code.");
} else {
  console.log("Could not find call code.");
}
