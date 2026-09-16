const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add index to map
  const oldMap = 'paginatedDecisions.map((decision) => {';
  const newMap = 'paginatedDecisions.map((decision, idx) => {';
  content = content.replace(oldMap, newMap);

  // Add animation class and style to the decision row
  // We recently changed the wrapper to: className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg motion-reduce:transition-none"
  
  const oldWrapper = 'className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg motion-reduce:transition-none"';
  
  // We need to add the animation and style
  const newWrapper = 'className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg motion-reduce:transition-none animate-fade-in-up" style={{ animationDelay: ${Math.min(idx * 60, 300)}ms }}';
  
  content = content.replace(oldWrapper, newWrapper);

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/dashboard/decision-history.tsx');
console.log('Updated src/components/dashboard/decision-history.tsx');
