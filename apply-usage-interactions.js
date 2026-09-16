const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Usage button
  const oldBtn = 'transition hover:bg-zinc-700 hover:text-white';
  const newBtn = 'transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldBtn, 'g'), newBtn);

  // Link
  const oldLink = 'underline font-semibold ml-2 hover:text-white';
  const newLink = 'underline font-semibold ml-2 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 rounded-sm motion-reduce:transition-none';
  content = content.replace(new RegExp(oldLink, 'g'), newLink);

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/usage-card.tsx');
console.log('Updated src/components/dashboard/usage-card.tsx');
