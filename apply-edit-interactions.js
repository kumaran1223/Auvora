const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Inputs, Textareas, Selects
  const oldInputClass = 'placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
  const newInputClass = 'placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none';
  content = content.replace(new RegExp(oldInputClass, 'g'), newInputClass);

  // Primary Button (bg-white text-zinc-950)
  const oldPrimaryBtn = 'hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  const oldCancelBtn2 = 'className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"';
  const newCancelBtn2 = 'className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldCancelBtn2, 'g'), newCancelBtn2);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/edit-decision-form.tsx');
console.log('Updated edit-decision-form.tsx');
