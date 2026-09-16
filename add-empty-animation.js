const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Empty state 1
  const oldEmpty1 = 'className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center space-y-4"';
  const newEmpty1 = 'className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center space-y-4 animate-fade-in-up"';
  content = content.replace(oldEmpty1, newEmpty1);

  // Empty state 2
  const oldEmpty2 = 'className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-3"';
  const newEmpty2 = 'className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-3 animate-fade-in-up"';
  content = content.replace(oldEmpty2, newEmpty2);

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/decision-history.tsx');
console.log('Updated empty states in src/components/dashboard/decision-history.tsx');
