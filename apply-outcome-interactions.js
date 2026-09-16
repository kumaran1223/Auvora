const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Cancel Button
  const oldCancelBtn = 'hover:bg-zinc-800"';
  const newCancelBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldCancelBtn, 'g'), newCancelBtn);

  // Submit Button
  const oldPrimaryBtn = 'hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  // Status Buttons (Radio-like)
  const oldStatusBtn = 'hover:border-zinc-600 hover:bg-zinc-800"';
  const newStatusBtn = 'transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldStatusBtn, 'g'), newStatusBtn);

  // Textarea
  const oldInputClass = 'placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
  const newInputClass = 'placeholder-zinc-500 transition-colors duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none';
  content = content.replace(new RegExp(oldInputClass, 'g'), newInputClass);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/outcome-modal.tsx');
console.log('Updated outcome-modal.tsx');
