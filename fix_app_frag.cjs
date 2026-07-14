const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The main return
content = content.replace(
  '  return (\n    <TiltWrapper',
  '  return (\n    <>\n    <TiltWrapper'
);

content = content.replace(
  '      </button>\n    </div>\n  );\n}',
  '      </button>\n    </div>\n    </>\n  );\n}'
);

fs.writeFileSync('src/App.tsx', content);
