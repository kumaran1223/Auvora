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
      
      // 1. Landing Page Width Upgrades (6xl -> [1400px])
      // Currently uses max-w-6xl. Let's upgrade to max-w-[1400px] or max-w-screen-xl (1280). Let's use max-w-[1400px] to be safely large.
      if (fullPath.includes('landing') || fullPath.includes('navbar') || fullPath.includes('footer')) {
        newContent = newContent.replace(/max-w-6xl/g, 'max-w-[1400px]');
      }

      // 2. Dashboard / Report Width Upgrades (5xl -> 7xl)
      // Currently uses max-w-5xl (1024px). Upgrade to max-w-7xl (1280px) for standard comfortable width.
      if (fullPath.includes('dashboard') || fullPath.includes('decisions') || fullPath.includes('report') || fullPath.includes('autopsy') || fullPath.includes('patterns') || fullPath.includes('pricing')) {
        newContent = newContent.replace(/max-w-5xl/g, 'max-w-7xl');
      }

      // 3. New Decision / Edit Form (2xl -> 3xl)
      // Currently max-w-2xl (672px). Upgrade to max-w-3xl (768px) to feel less cramped.
      if (fullPath.includes('decisions\\new') || fullPath.includes('decisions\\[id]\\edit') || fullPath.includes('decisions/new') || fullPath.includes('decisions/[id]/edit')) {
        newContent = newContent.replace(/max-w-2xl/g, 'max-w-3xl');
      }

      // 4. Report Navigation Sticky Bar
      if (fullPath.includes('report-navigation.tsx')) {
         newContent = newContent.replace(/max-w-5xl/g, 'max-w-7xl');
      }

      // 5. Landing Page Hero Scale Improvements
      if (fullPath.includes('hero.tsx')) {
        // Main Headline (was text-4xl sm:text-5xl lg:text-6xl)
        newContent = newContent.replace(/text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl/g, 'text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl');
        // If it was differently styled:
        newContent = newContent.replace(/text-4xl sm:text-5xl lg:text-6xl/g, 'text-5xl sm:text-6xl lg:text-7xl');
        // Let's just do a regex for text-4xl to text-5xl on the specific class in hero
        newContent = newContent.replace(/text-4xl(.*?)sm:text-5xl(.*?)lg:text-6xl/g, 'text-5xl$1sm:text-6xl$2lg:text-7xl');
        
        // Subtitle (was text-lg sm:text-xl text-zinc-400)
        newContent = newContent.replace(/text-lg text-zinc-400 sm:text-xl/g, 'text-xl text-zinc-400 sm:text-2xl');
        
        // Increase hero padding top/bottom to make it grander
        newContent = newContent.replace(/py-16 sm:py-24 lg:py-32/g, 'py-20 sm:py-32 lg:py-40');
      }

      // 6. Navbar scale
      if (fullPath.includes('navbar.tsx')) {
        // Increase padding
        newContent = newContent.replace(/p-4/g, 'p-6');
        newContent = newContent.replace(/text-lg font-bold tracking-tight text-white/g, 'text-xl font-bold tracking-tight text-white');
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('./src/app');
processDir('./src/components');
console.log('Layout scale upgrade complete.');

