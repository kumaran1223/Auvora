const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to add animate-fade-in-up and stagger delays to the sections inside decision-autopsy.
  const oldCode =         {replay && (
          <div className="space-y-12">
            {/* 1. Header & Alignment Score */}
            <AutopsyHeader replay={replay} />

            {/* Stale State Warning */}
            <ReplayStaleState replay={replay} outcome={outcome} />

            <div className="flex justify-end">
              <ReplayAgainDialog decisionId={decisionId} hasExistingReplay={true} />
            </div>

            {/* The Verdict */}
            <AutopsyVerdict verdict={replay.alignment_verdict as string} />

            {/* How It Happened */}
            <OutcomeTraceability
              traceability={replay.outcome_traceability as { events?: string[]; root_cause?: string }}
            />

            {/* Right vs. Differed Analysis */}
            <RightVsDiffered
              analysis={
                (replay.right_vs_differed as {
                  where_we_were_right?: string[];
                  where_we_differed?: string[];
                }) || {}
              }
            />

            {/* Assumption Audit */}
            <AssumptionAudit
              assumptionResults={
                (replay.assumption_results as Array<{
                  assumption_title: string;
                  result: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Risk Audit */}
            <RiskAudit
              riskResults={
                (replay.risk_results as Array<{
                  risk_title: string;
                  materialized: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Blind Spot Audit */}
            <BlindSpotAudit
              blindSpotResults={
                (replay.blind_spot_results as Array<{
                  blind_spot_title: string;
                  result: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Strategic Lessons & Take This Forward */}
            <StrategicLessons lessonsLearned={(replay.lessons_learned as string[]) || []} />

            {/* Real-World User Outcome */}
            <AutopsyOutcome outcome={outcome} />
          </div>
        )};

  const newCode =         {replay && (
          <div className="space-y-12">
            {/* 1. Header & Alignment Score */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <AutopsyHeader replay={replay} />
            </div>

            {/* Stale State Warning (No delay so warnings appear immediately) */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <ReplayStaleState replay={replay} outcome={outcome} />
            </div>

            <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '40ms' }}>
              <ReplayAgainDialog decisionId={decisionId} hasExistingReplay={true} />
            </div>

            {/* The Verdict */}
            <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
              <AutopsyVerdict verdict={replay.alignment_verdict as string} />
            </div>

            {/* How It Happened */}
            <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <OutcomeTraceability
                traceability={replay.outcome_traceability as { events?: string[]; root_cause?: string }}
              />
            </div>

            {/* Right vs. Differed Analysis */}
            <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
              <RightVsDiffered
                analysis={
                  (replay.right_vs_differed as {
                    where_we_were_right?: string[];
                    where_we_differed?: string[];
                  }) || {}
                }
              />
            </div>

            {/* Assumption Audit */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <AssumptionAudit
                assumptionResults={
                  (replay.assumption_results as Array<{
                    assumption_title: string;
                    result: string;
                    explanation: string;
                  }>) || []
                }
              />
            </div>

            {/* Risk Audit */}
            <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              <RiskAudit
                riskResults={
                  (replay.risk_results as Array<{
                    risk_title: string;
                    materialized: string;
                    explanation: string;
                  }>) || []
                }
              />
            </div>

            {/* Blind Spot Audit */}
            <div className="animate-fade-in-up" style={{ animationDelay: '280ms' }}>
              <BlindSpotAudit
                blindSpotResults={
                  (replay.blind_spot_results as Array<{
                    blind_spot_title: string;
                    result: string;
                    explanation: string;
                  }>) || []
                }
              />
            </div>

            {/* Strategic Lessons & Take This Forward */}
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <StrategicLessons lessonsLearned={(replay.lessons_learned as string[]) || []} />
            </div>

            {/* Real-World User Outcome */}
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <AutopsyOutcome outcome={outcome} />
            </div>
          </div>
        )};

  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content);
}

updateFile('src/components/autopsy/decision-autopsy.tsx');
console.log('Updated src/components/autopsy/decision-autopsy.tsx');
