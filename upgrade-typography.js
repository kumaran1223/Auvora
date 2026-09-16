const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content
        // Paragraph/Description text upgrades
        .replace(/text-xs text-zinc-400(?![^"]*uppercase)/g, 'text-sm text-zinc-400')
        .replace(/text-xs text-zinc-300(?![^"]*uppercase)/g, 'text-sm text-zinc-300')
        .replace(/text-xs text-zinc-200(?![^"]*uppercase)/g, 'text-sm text-zinc-200')
        .replace(/text-xs text-zinc-500(?![^"]*uppercase)/g, 'text-sm text-zinc-500')
        .replace(/text-xs text-white(?![^"]*uppercase)/g, 'text-sm text-white')
        .replace(/text-xs text-rose-300(?![^"]*uppercase)/g, 'text-sm text-rose-300')
        .replace(/text-xs text-rose-400(?![^"]*uppercase)/g, 'text-sm text-rose-400')
        .replace(/text-xs text-amber-300(?![^"]*uppercase)/g, 'text-sm text-amber-300')
        .replace(/text-xs text-amber-400(?![^"]*uppercase)/g, 'text-sm text-amber-400')
        .replace(/text-xs text-emerald-300(?![^"]*uppercase)/g, 'text-sm text-emerald-300')
        .replace(/text-xs text-emerald-400(?![^"]*uppercase)/g, 'text-sm text-emerald-400')
        .replace(/text-xs text-blue-300(?![^"]*uppercase)/g, 'text-sm text-blue-300')
        .replace(/text-xs text-blue-400(?![^"]*uppercase)/g, 'text-sm text-blue-400')
        
        // Button/Label upgrades
        .replace(/text-xs font-medium text-zinc-(?!.*uppercase)/g, 'text-sm font-medium text-zinc-')
        .replace(/text-xs font-semibold text-zinc-/g, 'text-sm font-semibold text-zinc-')
        .replace(/text-xs font-semibold text-white/g, 'text-sm font-semibold text-white')
        .replace(/text-xs font-bold text-white/g, 'text-sm font-bold text-white')
        .replace(/text-xs font-bold text-zinc-/g, 'text-sm font-bold text-zinc-')
        
        // Fix spacing and internal paddings slightly in report cards if they feel cramped
        // We'll leave spacing mostly alone unless specifically requested, but NextUI/Tailwind 
        // p-4 / p-5 is usually fine for text-sm.
        
        // Ensure inputs are readable
        .replace(/text-xs placeholder-zinc-500/g, 'text-sm placeholder-zinc-500');
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/app');
processDir('./src/components');
console.log('Typography upgrade complete.');

