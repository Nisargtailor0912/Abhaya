const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetAlert = 'alert(`EMERGENCY ALERTS DISPATCHED!\\n\\nAutomated SMS sent with your live location to:\\n- Local Police Station (100)\\n- Cyber Cell (1930)\\n- Trusted Contacts: ${contactNames}\\n\\nA secure call log has been created in the Admin Portal.`);';

const newAlert = 'alert(`EMERGENCY ALERTS DISPATCHED!\\n\\nAutomated SMS sent with your live location to:\\n- Local Police Station (100)\\n- Cyber Cell (1930)\\n- Trusted Contacts: ${contactNames}\\n\\n🚨 CRITICAL ALERT INITIATED:\\nA loud emergency siren has been triggered on the devices of your trusted contacts to ensure immediate attention.\\n\\nA secure call log has been created in the Admin Portal.`);';

if (content.includes(targetAlert)) {
  content = content.replace(targetAlert, newAlert);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Successfully updated SOS alert message");
} else {
  console.log("Could not find SOS alert message");
}
