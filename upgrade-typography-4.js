const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to upgrade `text-xs` to `text-sm` when it appears in these specific container classes 
      // or specific components from the report directory.
      
      let newContent = content
        .replace(/text-xs space-y-1/g, 'text-sm space-y-1')
        .replace(/text-xs space-y-3/g, 'text-sm space-y-3')
        .replace(/text-xs pt-1/g, 'text-sm pt-1')
        .replace(/text-xs text-zinc-500 italic/g, 'text-sm text-zinc-500 italic')
        .replace(/text-xs font-mono text-zinc-400/g, 'text-sm font-mono text-zinc-400')
        .replace(/border-zinc-800 text-xs/g, 'border-zinc-800 text-sm')
        .replace(/space-x-2 text-xs/g, 'space-x-2 text-sm')
        .replace(/justify-between text-xs/g, 'justify-between text-sm');

      // The kill questions number badge is fine as text-xs
      // The report navigation bar is fine as text-xs font-medium no-scrollbar (Wait, let's bump the nav bar too to text-sm)
      newContent = newContent.replace(/text-xs font-medium no-scrollbar/g, 'text-sm font-medium no-scrollbar');
      newContent = newContent.replace(/text-xs font-medium text-purple-200/g, 'text-sm font-medium text-purple-200');
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/components/report');
processDir('./src/components');
console.log('Typography upgrade 4 complete.');

