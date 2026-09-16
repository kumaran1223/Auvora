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
      
      let newContent = content;
      
      if (fullPath.includes('report') || fullPath.includes('autopsy') || fullPath.includes('patterns') || fullPath.includes('dashboard')) {
        // Only upgrade the dense paragraph texts to text-base, leave labels/badges as text-sm or text-xs
        newContent = newContent.replace(/<p className="text-sm text-zinc-300 leading-relaxed">/g, '<p className="text-base text-zinc-300 leading-relaxed">');
        newContent = newContent.replace(/<p className="text-sm text-zinc-400 leading-relaxed">/g, '<p className="text-base text-zinc-400 leading-relaxed">');
        newContent = newContent.replace(/<p className="text-sm text-zinc-400">/g, '<p className="text-base text-zinc-400">');
        newContent = newContent.replace(/<p className="text-sm text-zinc-300">/g, '<p className="text-base text-zinc-300">');
        
        // Upgrade titles to make them stand out
        newContent = newContent.replace(/<h2 className="text-xl font-bold tracking-tight text-white">/g, '<h2 className="text-2xl font-bold tracking-tight text-white">');
        newContent = newContent.replace(/<h3 className="text-sm font-semibold text-white">/g, '<h3 className="text-base font-semibold text-white">');
        newContent = newContent.replace(/<h3 className="text-sm font-semibold text-zinc-200">/g, '<h3 className="text-base font-semibold text-zinc-200">');
        
        // Increase padding on standard cards
        newContent = newContent.replace(/bg-zinc-900\/40 p-4/g, 'bg-zinc-900/40 p-6');
        newContent = newContent.replace(/bg-zinc-900\/50 p-4/g, 'bg-zinc-900/50 p-6');
        newContent = newContent.replace(/bg-zinc-900\/60 p-4/g, 'bg-zinc-900/60 p-6');
        newContent = newContent.replace(/bg-zinc-950\/40 p-4/g, 'bg-zinc-950/40 p-6');
        newContent = newContent.replace(/bg-zinc-950\/60 p-4/g, 'bg-zinc-950/60 p-6');
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/components');
console.log('Dashboard typography upgrade complete.');

