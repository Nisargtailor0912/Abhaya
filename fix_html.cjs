const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('theme-color')) {
  html = html.replace(
    '</head>',
    '  <meta name="theme-color" content="#ffffff" />\n    <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3204/3204018.png">\n  </head>'
  );
  fs.writeFileSync('index.html', html);
}
