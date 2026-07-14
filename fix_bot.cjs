const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add botMessages state
const botMessagesState = `  const [botMessages, setBotMessages] = useState<any[]>([\n    { id: '1', role: 'assistant', content: "Hello, I'm the Abhaya Bot. I'm here to offer advice, safety tips, or just listen if you need someone to talk to. How can I support you today?" }\n  ]);\n\n  const toggleSetting =`;

app = app.replace('  const toggleSetting =', botMessagesState);

// Pass props
app = app.replace(
  '<SafetyBot onClose={() => setShowBot(false)} />',
  '<SafetyBot onClose={() => setShowBot(false)} messages={botMessages} setMessages={setBotMessages} />'
);

fs.writeFileSync('src/App.tsx', app);

let bot = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

// Update props
bot = bot.replace(
  'export default function SafetyBot({ onClose }: { onClose: () => void }) {',
  'export default function SafetyBot({ onClose, messages, setMessages }: { onClose: () => void, messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {'
);

bot = bot.replace(
  `  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello, I'm the Abhaya Bot. I'm here to offer advice, safety tips, or just listen if you need someone to talk to. How can I support you today?" }
  ]);`,
  ''
);

// Fix styling issue for user messages
bot = bot.replace(
  "? 'bg-indigo-100 text-slate-900 dark:text-slate-100 rounded-tr-sm'",
  "? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'"
);

// We need to also change the prose styling for markdown
bot = bot.replace(
  '<div className="text-[15px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none [&>p]:mb-0 [&>p]:mt-0">',
  '<div className={`text-[15px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none [&>p]:mb-0 [&>p]:mt-0 ${msg.role === "user" ? "text-white prose-p:text-white prose-strong:text-white" : ""}`}>'
);

fs.writeFileSync('src/components/SafetyBot.tsx', bot);

