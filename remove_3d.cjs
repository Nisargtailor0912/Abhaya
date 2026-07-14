const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove TiltWrapper import
  content = content.replace(/import TiltWrapper.*?;?\n/g, '');
  
  // Remove <TiltWrapper ...> and </TiltWrapper>
  content = content.replace(/<TiltWrapper[^>]*>/g, '');
  content = content.replace(/<\/TiltWrapper>/g, '');

  // Remove preserve-3d
  content = content.replace(/ style=\{\{ transformStyle: "preserve-3d"[, ]*([^}]*) \}\}/g, function(match, p1) {
      if (p1.trim()) return ' style={{ ' + p1 + ' }}';
      return '';
  });
  content = content.replace(/ style=\{\{.*transformStyle:\s*["']preserve-3d["'].*?\}\}/g, '');
  
  // Remove translateZ and other transform styles explicitly if added previously
  content = content.replace(/ style=\{\{ transform: "translateZ\([^)]+\)" \}\}/g, '');
  content = content.replace(/ style=\{\{ transform: "translateZ\([^)]+\)"[^\}]+\}\}/g, '');

  content = content.replace(/ style=\{\{\s*transform:\s*"translateZ[^}]+\}\}/g, '');
  content = content.replace(/ style=\{\{\s*touchAction:\s*"none",\s*transform:\s*"translateZ[^}]+\}\}/g, ' style={{ touchAction: "none" }}');

  fs.writeFileSync(filePath, content);
}

['src/App.tsx', 'src/components/Auth.tsx', 'src/components/SafetyBot.tsx', 'src/components/SlideToAnswer.tsx', 'src/components/SlideToSOS.tsx'].forEach(cleanFile);

