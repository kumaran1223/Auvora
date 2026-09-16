const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const oldPrimaryBtn = 'hover:bg-zinc-200 disabled:opacity-50';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/stress-test-button.tsx');
console.log('Updated stress-test-button.tsx');
