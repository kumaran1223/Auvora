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
        .replace(/text-xs text-red-/g, 'text-sm text-red-')
        .replace(/text-xs text-zinc-500/g, 'text-sm text-zinc-500'); // sometimes zinc-500 is used for descriptions
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/app');
processDir('./src/components');
console.log('Typography upgrade complete.');

