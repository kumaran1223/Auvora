const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Currently: <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
  const oldWrapper = 'className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4"';
  const newWrapper = 'className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 animate-fade-in-up"';
  content = content.replace(new RegExp(oldWrapper, 'g'), newWrapper);

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/usage-card.tsx');
console.log('Updated src/components/dashboard/usage-card.tsx');
