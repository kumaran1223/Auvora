const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to add the entrance animation to the main wrapper inside the <main> block
  // Currently: <div className="mx-auto max-w-7xl space-y-8">
  const oldWrapper = 'className="mx-auto max-w-7xl space-y-8"';
  const newWrapper = 'className="mx-auto max-w-7xl space-y-8 animate-fade-in-up"';
  content = content.replace(new RegExp(oldWrapper, 'g'), newWrapper);

  fs.writeFileSync(filePath, content);
}

updateFile('src/app/dashboard/page.tsx');
console.log('Updated src/app/dashboard/page.tsx');
