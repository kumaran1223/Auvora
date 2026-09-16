const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const oldCode =             <>
              <ExecutiveStressTest report={parsedReport} />
              <AssumptionRiskMap report={parsedReport} />
              <EvidenceGaps report={parsedReport} />
              <BlindSpots report={parsedReport} />
              <StakeholderAnalysis report={parsedReport} />
              <RiskAnalysis report={parsedReport} />
              <ConsequenceChains report={parsedReport} />
              <ScenarioAnalysis report={parsedReport} />
              <AlternativePaths report={parsedReport} />
              <KillQuestions report={parsedReport} />
              <FinalStressTest report={parsedReport} />
            </>;

  const newCode =             <>
              <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}><ExecutiveStressTest report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}><AssumptionRiskMap report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}><EvidenceGaps report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '180ms' }}><BlindSpots report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}><StakeholderAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><RiskAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><ConsequenceChains report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><ScenarioAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><AlternativePaths report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><KillQuestions report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><FinalStressTest report={parsedReport} /></div>
            </>;

  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content);
}

updateFile('src/app/decisions/[id]/page.tsx');
console.log('Updated src/app/decisions/[id]/page.tsx');
