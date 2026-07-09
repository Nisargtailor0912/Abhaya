const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyBot.tsx', 'utf8');

// Add react-markdown import
content = content.replace("import { Bot, Send, X, ShieldAlert, Loader2 } from 'lucide-react';", "import { Bot, Send, X, ShieldAlert, Loader2 } from 'lucide-react';\nimport Markdown from 'react-markdown';");

// Remove emergency banner
const bannerRegex = /\s*\{\/\*\s*Emergency Warning Banner\s*\*\/\}\s*<div className="bg-rose-50[^>]+>[\s\S]*?<\/div>/g;
content = content.replace(bannerRegex, '');

// Replace <p> rendering with react-markdown
const pRegex = /<p className="text-\[15px\] leading-relaxed whitespace-pre-wrap">\{msg\.content\}<\/p>/g;
content = content.replace(pRegex, '<div className="text-[15px] leading-relaxed whitespace-pre-wrap markdown-body"><Markdown>{msg.content}</Markdown></div>');

fs.writeFileSync('src/components/SafetyBot.tsx', content, 'utf8');
