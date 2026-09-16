const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Button
  const oldBtn = 'transition hover:bg-zinc-800"';
  const newBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldBtn, 'g'), newBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/outcome-section.tsx');
console.log('Updated outcome-section.tsx');
