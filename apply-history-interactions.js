const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Input
  const oldSearchInput = 'placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
  const newSearchInput = 'placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none';
  content = content.replace(new RegExp(oldSearchInput, 'g'), newSearchInput);

  // Selects
  const oldSelect = 'focus:border-zinc-500 focus:outline-none';
  const newSelect = 'transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none';
  content = content.replace(new RegExp(oldSelect, 'g'), newSelect);

  // Buttons (Primary)
  const oldPrimary1 = 'transition hover:bg-zinc-200';
  const newPrimary1 = 'transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPrimary1, 'g'), newPrimary1);

  // Pagination buttons
  const oldPageBtn = 'transition hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed';
  const newPageBtn = 'transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:opacity-40 disabled:pointer-events-none motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldPageBtn, 'g'), newPageBtn);

  // Open Decision Button
  const oldOpenBtn = 'transition hover:bg-zinc-700';
  const newOpenBtn = 'transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none';
  content = content.replace(new RegExp(oldOpenBtn, 'g'), newOpenBtn);

  // Card hover
  const oldCardHover = 'transition hover:bg-zinc-900/80';
  const newCardHover = 'transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg motion-reduce:transition-none';
  content = content.replace(new RegExp(oldCardHover, 'g'), newCardHover);

  // Links (Clear filters)
  const oldLink = 'text-amber-400 hover:underline';
  const newLink = 'text-amber-400 transition-colors duration-200 hover:text-amber-300 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-sm motion-reduce:transition-none';
  content = content.replace(new RegExp(oldLink, 'g'), newLink);

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/decision-history.tsx');
console.log('Updated src/components/dashboard/decision-history.tsx');
