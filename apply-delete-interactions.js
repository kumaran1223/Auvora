const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Cancel Button
  const oldCancelBtn = 'hover:bg-zinc-800"';
  const newCancelBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldCancelBtn, 'g'), newCancelBtn);

  // Delete (Destructive) Button
  const oldDestructBtn = 'hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50';
  const newDestructBtn = 'transition-all duration-200 hover:bg-red-600 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldDestructBtn, 'g'), newDestructBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/delete-modal.tsx');
console.log('Updated delete-modal.tsx');
