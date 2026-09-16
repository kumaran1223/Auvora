const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to add the entrance animation to OutcomeSection
  // Currently: <OutcomeSection decisionId={decision.id} outcome={outcome} />
  const oldOutcome = '<OutcomeSection decisionId={decision.id} outcome={outcome} />';
  const newOutcome = '<div className="animate-fade-in-up" style={{ animationDelay: \\'300ms\\' }}><OutcomeSection decisionId={decision.id} outcome={outcome} /></div>';
  content = content.replace(oldOutcome, newOutcome);

  // DecisionAutopsy
  const oldAutopsy = '<DecisionAutopsy';
  const newAutopsy = '<div className="animate-fade-in-up" style={{ animationDelay: \\'300ms\\' }}><DecisionAutopsy';
  // But DecisionAutopsy is multiline, so we can just replace the opening tag and closing tag.
  content = content.replace(oldAutopsy, newAutopsy);
  
  const oldAutopsyClose = 'replay={replay}\n        />';
  const newAutopsyClose = 'replay={replay}\n        /></div>';
  content = content.replace(oldAutopsyClose, newAutopsyClose);

  fs.writeFileSync(filePath, content);
}

updateFile('src/app/decisions/[id]/page.tsx');
console.log('Updated src/app/decisions/[id]/page.tsx for Outcome and Autopsy');
