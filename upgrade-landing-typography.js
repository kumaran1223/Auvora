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
      
      if (fullPath.includes('landing')) {
        // Upgrade section sub-descriptions from text-sm to text-lg or text-base
        newContent = newContent.replace(/<p className="text-sm text-zinc-400">/g, '<p className="text-lg text-zinc-400 leading-relaxed">');
        
        // Upgrade grid card titles from text-base to text-xl
        newContent = newContent.replace(/<h3 className="text-base font-bold text-white">/g, '<h3 className="text-xl font-bold text-white">');
        newContent = newContent.replace(/<h3 className="text-base font-semibold text-white">/g, '<h3 className="text-xl font-bold text-white">');
        newContent = newContent.replace(/<h3 className="font-semibold text-white">/g, '<h3 className="text-lg font-bold text-white">');
        
        // Upgrade grid card descriptions from text-sm to text-base
        newContent = newContent.replace(/<p className="text-sm text-zinc-400/g, '<p className="text-base text-zinc-400');
        newContent = newContent.replace(/<p className="mt-2 text-sm text-zinc-400">/g, '<p className="mt-3 text-base text-zinc-400 leading-relaxed">');
        
        // Upgrade section major headings from text-3xl to text-4xl
        newContent = newContent.replace(/text-3xl font-extrabold tracking-tight text-white sm:text-4xl/g, 'text-4xl font-extrabold tracking-tight text-white sm:text-5xl');
        
        // Ensure card paddings are generous for the larger text (p-5 -> p-6, p-6 -> p-8)
        newContent = newContent.replace(/bg-zinc-900\/40 p-5/g, 'bg-zinc-900/40 p-8');
        newContent = newContent.replace(/bg-zinc-900\/40 p-6/g, 'bg-zinc-900/40 p-8');
        newContent = newContent.replace(/bg-zinc-900\/60 p-6/g, 'bg-zinc-900/60 p-8');
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/components/landing');
console.log('Landing typography upgrade complete.');

