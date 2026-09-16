const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Trigger button
  const oldBtn1 = 'transition hover:bg-zinc-800 disabled:opacity-50';
  const newBtn1 = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldBtn1, 'g'), newBtn1);

  // Secondary Button (Cancel)
  const oldBtn2 = 'transition hover:bg-zinc-800"';
  const newBtn2 = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldBtn2, 'g'), newBtn2);

  // Primary Button (Confirm)
  const oldPrimaryBtn = 'hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-amber-400 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/reanalyze-dialog.tsx');
console.log('Updated reanalyze-dialog.tsx');
