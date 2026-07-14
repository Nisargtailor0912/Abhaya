const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '      </button>\n    </div>\n    </>\n  );\n}',
  '      </button>\n    </>\n  );\n}'
);

fs.writeFileSync('src/App.tsx', content);
