import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  AuvoraReportSchema,
  type AuvoraReportData,
  AuvoraReplaySchema,
  type AuvoraReplayData,
  AuvoraPatternReportSchema,
  type AuvoraPatternReportData,
} from "./schemas";
import {
  AUVORA_SYSTEM_PROMPT,
  AUVORA_REPLAY_SYSTEM_PROMPT,
  AUVORA_PATTERN_SYSTEM_PROMPT,
} from "./prompts";
import type {
  NormalizedDecisionContext,
  NormalizedReplayContext,
  NormalizedPatternInput,
} from "./types";

export async function runAuvoraAnalysis(
  context: NormalizedDecisionContext
): Promise<AuvoraReportData> {
  const apiKey = process.env["OPENAI_API_KEY"];
  const model = process.env["OPENAI_MODEL"] || "gpt-5.6-luna";

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OpenAI API key is not configured on the server.");
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = `
Please stress-test the following business decision using the Auvora Analysis Framework:

DECISION METADATA & CONTEXT:
- Title: ${context.decision.title}
- Description: ${context.decision.description}
- Industry: ${context.decision.industry ?? "Not specified"}
- Company Size: ${context.decision.company_size ?? "Not specified"}
- Budget: ${context.decision.budget != null ? context.decision.budget : "Not specified"}
- Time Horizon: ${context.decision.timeline ?? "Not specified"}
- Success Definition: ${context.decision.success_definition ?? "Not specified"}
`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: AUVORA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(AuvoraReportSchema, "auvora_report"),
    });

    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new Error("AI returned empty response content.");
    }

    const parsedJson = JSON.parse(content);
    const report = AuvoraReportSchema.parse(parsedJson);

    return report;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`AI Analysis Execution Failed: ${err.message}`);
    }
    throw new Error("AI Analysis Execution Failed with an unknown error.");
  }
}

export async function runAuvoraReplay(
  context: NormalizedReplayContext
): Promise<AuvoraReplayData> {
  const apiKey = process.env["OPENAI_API_KEY"];
  const model = process.env["OPENAI_MODEL"] || "gpt-5.6-luna";

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OpenAI API key is not configured on the server.");
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = `
Please audit prediction alignment for the following decision:

1. ORIGINAL DECISION METADATA:
- Title: ${context.decision.title}
- Description: ${context.decision.description}
- Success Definition: ${context.decision.success_definition ?? "Not specified"}
- Time Horizon: ${context.decision.timeline ?? "Not specified"}

2. ORIGINAL AUVORA ANALYSIS (BASELINE PREDICTIONS):
- Key Assumptions: ${JSON.stringify(context.original_analysis.assumptions, null, 2)}
- Evidence Gaps: ${JSON.stringify(context.original_analysis.evidence_gaps, null, 2)}
- Blind Spots: ${JSON.stringify(context.original_analysis.blind_spots, null, 2)}
- Key Risks: ${JSON.stringify(context.original_analysis.risks, null, 2)}
- Scenarios: ${JSON.stringify(context.original_analysis.scenarios, null, 2)}
- Final Stress-test Reasoning: ${JSON.stringify(context.original_analysis.final_stress_test, null, 2)}

3. REAL-WORLD RECORDED OUTCOME (USER-REPORTED GROUND TRUTH):
- Status: ${context.recorded_outcome.outcome_status}
- What Actually Happened: ${context.recorded_outcome.what_happened}
- What Surprised You: ${context.recorded_outcome.what_surprised_you}
- Recorded Date: ${context.recorded_outcome.recorded_at}
`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: AUVORA_REPLAY_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(AuvoraReplaySchema, "auvora_replay"),
    });

    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new Error("AI returned empty replay response content.");
    }

    const parsedJson = JSON.parse(content);
    const replay = AuvoraReplaySchema.parse(parsedJson);

    return replay;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`AI Replay Execution Failed: ${err.message}`);
    }
    throw new Error("AI Replay Execution Failed with an unknown error.");
  }
}

export async function runAuvoraPatternAnalysis(
  input: NormalizedPatternInput
): Promise<AuvoraPatternReportData> {
  const apiKey = process.env["OPENAI_API_KEY"];
  const model = process.env["OPENAI_MODEL"] || "gpt-5.6-luna";

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OpenAI API key is not configured on the server.");
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = `
Please analyze historical decision patterns across the following dataset of ${input.total_eligible_decisions} decisions:

HISTORICAL DECISION DATASET:
${JSON.stringify(input, null, 2)}
`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: AUVORA_PATTERN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(AuvoraPatternReportSchema, "auvora_pattern_report"),
    });

    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new Error("AI returned empty pattern report content.");
    }

    const parsedJson = JSON.parse(content);
    const patternReport = AuvoraPatternReportSchema.parse(parsedJson);

    return patternReport;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`AI Pattern Analysis Execution Failed: ${err.message}`);
    }
    throw new Error("AI Pattern Analysis Execution Failed with an unknown error.");
  }
}



