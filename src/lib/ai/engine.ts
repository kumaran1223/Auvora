import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AuvoraReportSchema, type AuvoraReportData } from "./schemas";
import { AUVORA_SYSTEM_PROMPT } from "./prompts";
import type { NormalizedDecisionContext } from "./types";

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

