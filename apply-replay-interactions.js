const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Input
  const oldInput = 'placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
  const newInput = 'placeholder-zinc-500 transition-colors duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none';
  content = content.replace(new RegExp(oldInput, 'g'), newInput);

  // Primary Button
  const oldPrimaryBtn = 'transition hover:bg-zinc-200 disabled:opacity-50';
  const newPrimaryBtn = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimaryBtn, 'g'), newPrimaryBtn);

  // Restart Replay Button
  const oldRestartBtn = 'transition hover:bg-zinc-800"';
  const newRestartBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
  content = content.replace(new RegExp(oldRestartBtn, 'g'), newRestartBtn);

  fs.writeFileSync(filePath, content);
}
updateFile('src/components/decisions/replay-section.tsx');
console.log('Updated replay-section.tsx');
