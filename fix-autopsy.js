const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix OutcomeTraceability duplicate
  content = content.replace(/<OutcomeTraceability[\s\S]*?\/>\s*<div className="animate-fade-in-up"/, '<div className="animate-fade-in-up"');

  // Wrap Header
  content = content.replace(/<AutopsyHeader([^>]+)\/>/, '<div className="animate-fade-in-up" style={{ animationDelay: \\'0ms\\' }}><AutopsyHeader/></div>');

  // Wrap Stale State
  content = content.replace(/<ReplayStaleState([^>]+)\/>/, '<div className="animate-fade-in-up" style={{ animationDelay: \\'0ms\\' }}><ReplayStaleState/></div>');

  // Wrap Dialog
  content = content.replace(/<div className="flex justify-end">\s*<ReplayAgainDialog([^>]+)\/>\s*<\/div>/, '<div className="flex justify-end animate-fade-in-up" style={{ animationDelay: \\'40ms\\' }}>\n              <ReplayAgainDialog/>\n            </div>');

  // Wrap Verdict
  content = content.replace(/<AutopsyVerdict[\s\S]*?\/>/, '<div className="animate-fade-in-up" style={{ animationDelay: \\'80ms\\' }}>\n$&</div>');

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/autopsy/decision-autopsy.tsx');
console.log('Fixed decision-autopsy.tsx wrapper');
