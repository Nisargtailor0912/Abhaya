const fs = require('fs');
let content = fs.readFileSync('src/components/SlideToAnswer.tsx', 'utf8');

if (!content.includes('import TiltWrapper')) {
  content = "import TiltWrapper from './TiltWrapper';\n" + content;
}

content = content.replace(
  '    <div \n      ref={containerRef}',
  '    <TiltWrapper className="w-full max-w-sm"><div \n      ref={containerRef}'
);

content = content.replace(
  '    >      {/* Shimmer Text */}      <div className="absolute',
  '      style={{ transformStyle: "preserve-3d" }}>      {/* Shimmer Text */}      <div className="absolute'
);

content = content.replace(
  '        style={{ touchAction: "none" }}',
  '        style={{ touchAction: "none", transform: "translateZ(30px)" }}'
);

content = content.replace(
  '    </div>\n  );\n}',
  '    </div></TiltWrapper>\n  );\n}'
);

fs.writeFileSync('src/components/SlideToAnswer.tsx', content);
