const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Cancel Button
  const oldCancelBtn = 'hover:bg-zinc-800"';
  const newCancelBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldCancelBtn, 'g'), newCancelBtn);

  // Primary Upgrade Button
  const oldPrimaryBtn = 'hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/limit-modal.tsx');
console.log('Updated limit-modal.tsx');
