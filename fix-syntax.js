const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix syntax error
  const badSyntax = 'style={{ animationDelay: \\ms }}';
  const goodSyntax = 'style={{ animationDelay: \\ms }}';
  
  content = content.replace(badSyntax, goodSyntax);

  // If previous one failed, maybe $ is just $ not \$.
  content = content.replace('style={{ animationDelay: ms }}', 'style={{ animationDelay: \\ms }}');

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/decision-history.tsx');
console.log('Fixed syntax in src/components/dashboard/decision-history.tsx');
