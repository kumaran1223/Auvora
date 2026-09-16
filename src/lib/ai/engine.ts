import { GoogleGenAI } from "@google/genai";
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
import { createClient } from "@supabase/supabase-js";

export class GlobalProviderQuotaExhaustedError extends Error {
  constructor(message = "Auvora's AI analysis is temporarily unavailable. Please try again later.") {
    super(message);
    this.name = "GlobalProviderQuotaExhaustedError";
  }
}

export class GlobalProviderGuardError extends Error {
  constructor(message = "Unable to safely reserve a provider request.") {
    super(message);
    this.name = "GlobalProviderGuardError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminSupabaseClient: any = null;
function getAdminSupabaseClient() {
  if (adminSupabaseClient) return adminSupabaseClient;

  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const secretKey = process.env["SUPABASE_SECRET_KEY"];

  if (!url || !secretKey) {
    return null;
  }
  adminSupabaseClient = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return adminSupabaseClient;
}

async function reserveProviderRequest(provider: string = "gemini"): Promise<void> {
  const limitStr = process.env["AUVORA_GEMINI_DAILY_REQUEST_LIMIT"];
  const limit = limitStr ? parseInt(limitStr, 10) : 500;
  
  if (isNaN(limit) || limit <= 0) {
    throw new GlobalProviderGuardError("Invalid AUVORA_GEMINI_DAILY_REQUEST_LIMIT configuration.");
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    console.error("Global AI guard failed: SUPABASE_SECRET_KEY not configured.");
    throw new GlobalProviderGuardError();
  }

  const t_guard_start = performance.now();
  const { data, error } = await supabase.rpc("reserve_ai_provider_request", {
    p_provider: provider,
    p_daily_limit: limit
  });
  console.log(`[AI LATENCY] global-provider-guard: ${Math.round(performance.now() - t_guard_start)}ms`);

  if (error) {
    console.error("Global AI guard error (masked from client):", error.message);
    throw new GlobalProviderGuardError();
  }

  if (data === false) {
    throw new GlobalProviderQuotaExhaustedError();
  }
}

function getGeminiClient(): { ai: GoogleGenAI; model: string } {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const rawModel = (process.env["GEMINI_MODEL"] || "gemini-3.5-flash").trim();
  let model = rawModel;
  if (rawModel.toLowerCase().includes("flash")) {
    model = "gemini-3.5-flash";
  }

  const ai = new GoogleGenAI({ apiKey });
  return { ai, model };
}

function isTransientGeminiError(err: unknown): boolean {
  if (!err) return false;
  const str = String(err).toLowerCase();
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  const status = (err as { status?: string | number })?.status;
  const code = (err as { code?: string | number })?.code;

  return (
    status === 503 ||
    status === "UNAVAILABLE" ||
    code === 503 ||
    code === "UNAVAILABLE" ||
    str.includes("503") ||
    str.includes("unavailable") ||
    str.includes("high demand") ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand")
  );
}

function isDailyQuotaExhaustionError(err: unknown): boolean {
  if (!err) return false;
  const str = String(err).toLowerCase();
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  const status = (err as { status?: string | number })?.status;
  const code = (err as { code?: string | number })?.code;

  return (
    status === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    code === 429 ||
    code === "RESOURCE_EXHAUSTED" ||
    str.includes("429") ||
    str.includes("resource_exhausted") ||
    str.includes("free_tier_requests") ||
    msg.includes("429") ||
    msg.includes("resource_exhausted") ||
    msg.includes("free_tier_requests")
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom adapter to convert Zod 4 schemas to JSON Schema for Gemini structured output
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function zodToJsonSchemaCustom(schema: any): any {
  if (!schema || !schema._def) return {};
  const def = schema._def;
  switch (def.type) {
    case 'string':
      return { type: 'string' };
    case 'number':
      return { type: 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'array':
      return { type: 'array', items: zodToJsonSchemaCustom(def.element) };
    case 'enum':
      return { type: 'string', enum: Object.keys(def.entries) };
    case 'object': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const properties: any = {};
      const required: string[] = [];
      for (const [key, propSchema] of Object.entries(def.shape)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const propDef = (propSchema as any)._def;
        if (propDef && propDef.type === 'optional') {
          properties[key] = zodToJsonSchemaCustom(propDef.innerType);
        } else {
          properties[key] = zodToJsonSchemaCustom(propSchema);
          required.push(key);
        }
      }
      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
        additionalProperties: false,
      };
    }
    case 'optional':
    case 'nullable':
      return zodToJsonSchemaCustom(def.innerType);
    default:
      return {};
  }
}

export async function runAuvoraAnalysis(
  context: NormalizedDecisionContext
): Promise<AuvoraReportData> {
  const { ai, model } = getGeminiClient();

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

  const maxAttempts = 3;
  let lastError: unknown = null;
  const FALLBACK_MODEL = "gemini-3.5-flash-lite";

  const jsonSchema = zodToJsonSchemaCustom(AuvoraReportSchema);
  if (jsonSchema.type !== "object" || !jsonSchema.properties || !jsonSchema.properties.summary) {
    console.error("Generated JSON Schema is malformed.");
    throw new Error("Failed to generate a valid JSON Schema for Gemini.");
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let t_primary_start: number = 0;
    try {
      await reserveProviderRequest();
      t_primary_start = performance.now();
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: AUVORA_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseSchema: jsonSchema as any,
        },
      });
      console.log(`[AI LATENCY] ${model} (primary): ${Math.round(performance.now() - t_primary_start)}ms (status: success)`);

      const t_validation_start = performance.now();
      const content = response.text;
      
      console.log(`[DEBUG AI RESPONSE] Model: ${model} (Primary)`);
      console.log(`[DEBUG AI RESPONSE] Length: ${content?.length ?? 0}`);
      try { if (content) console.log(`[DEBUG AI RESPONSE] Keys:`, Object.keys(JSON.parse(content))); } catch (e) { console.log(`[DEBUG AI RESPONSE] Invalid JSON:`, String(e)); }

      if (!content || content.trim() === "") {
        console.log(`[AI LATENCY] report-validation: ${Math.round(performance.now() - t_validation_start)}ms (status: failed)`);
        throw new Error("AI returned empty response content.");
      }

      const parsedJson = JSON.parse(content);
      const report = AuvoraReportSchema.parse(parsedJson);
      console.log(`[AI LATENCY] report-validation: ${Math.round(performance.now() - t_validation_start)}ms (status: success)`);

      return report;
    } catch (err: unknown) {
      if (t_primary_start > 0 && !(err instanceof GlobalProviderQuotaExhaustedError) && !(err instanceof GlobalProviderGuardError) && !(err instanceof Error && err.message === "AI returned empty response content.") && !(err instanceof Error && err.name === "ZodError")) {
        console.log(`[AI LATENCY] ${model} (primary): ${Math.round(performance.now() - t_primary_start)}ms (status: failed)`);
      }
      
      if (err instanceof GlobalProviderQuotaExhaustedError || err instanceof GlobalProviderGuardError) {
        throw err;
      }
      
      lastError = err;

      const isQuotaExhausted = isDailyQuotaExhaustionError(err);
      if (isQuotaExhausted) {
        console.warn("Primary model daily quota exhausted. Triggering fallback.");
        break;
      }

      const isTransient = isTransientGeminiError(err);
      if (isTransient && attempt < maxAttempts) {
        const baseDelay = attempt === 1 ? 2000 : 5000;
        const jitter = Math.floor(Math.random() * (attempt === 1 ? 500 : 1000));
        await sleep(baseDelay + jitter);
        continue;
      }

      break;
    }
  }

  const needsFallback = isTransientGeminiError(lastError) || isDailyQuotaExhaustionError(lastError);

  let t_fallback_start: number = 0;
  if (needsFallback) {
    try {
      console.warn("Attempting fallback model:", FALLBACK_MODEL);

      await reserveProviderRequest();
      t_fallback_start = performance.now();
      const fallbackResponse = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: AUVORA_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseSchema: jsonSchema as any,
        },
      });
      console.log(`[AI LATENCY] ${FALLBACK_MODEL} (fallback): ${Math.round(performance.now() - t_fallback_start)}ms (status: success)`);

      const t_fb_validation_start = performance.now();
      const fallbackContent = fallbackResponse.text;
      
      console.log(`[DEBUG AI RESPONSE] Model: ${FALLBACK_MODEL} (Fallback)`);
      console.log(`[DEBUG AI RESPONSE] Length: ${fallbackContent?.length ?? 0}`);
      try { if (fallbackContent) console.log(`[DEBUG AI RESPONSE] Keys:`, Object.keys(JSON.parse(fallbackContent))); } catch (e) { console.log(`[DEBUG AI RESPONSE] Invalid JSON:`, String(e)); }

      if (!fallbackContent || fallbackContent.trim() === "") {
        console.log(`[AI LATENCY] report-validation: ${Math.round(performance.now() - t_fb_validation_start)}ms (status: failed)`);
        throw new Error("AI returned empty response content.");
      }

      let cleanedContent = fallbackContent.trim();
      const match = cleanedContent.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      if (match && match[1]) {
        cleanedContent = match[1].trim();
      }

      const fallbackParsedJson = JSON.parse(cleanedContent);
      const fallbackReport = AuvoraReportSchema.parse(fallbackParsedJson);
      console.log(`[AI LATENCY] report-validation: ${Math.round(performance.now() - t_fb_validation_start)}ms (status: success)`);

      console.warn("Fallback model succeeded.");
      return fallbackReport;
    } catch (fallbackErr: unknown) {
      if (t_fallback_start > 0 && !(fallbackErr instanceof GlobalProviderQuotaExhaustedError) && !(fallbackErr instanceof GlobalProviderGuardError) && !(fallbackErr instanceof Error && fallbackErr.message === "AI returned empty response content.") && !(fallbackErr instanceof Error && fallbackErr.name === "ZodError")) {
        console.log(`[AI LATENCY] ${FALLBACK_MODEL} (fallback): ${Math.round(performance.now() - t_fallback_start)}ms (status: failed)`);
      }
      if (fallbackErr instanceof GlobalProviderQuotaExhaustedError || fallbackErr instanceof GlobalProviderGuardError) {
        throw fallbackErr;
      }
      console.error("Fallback model failed.");
      lastError = fallbackErr;
    }
  }

  if (lastError instanceof Error) {
    throw new Error(`AI Analysis Execution Failed: ${lastError.message}`);
  }
  throw new Error("AI Analysis Execution Failed with an unknown error.");
}

export async function runAuvoraReplay(
  context: NormalizedReplayContext
): Promise<AuvoraReplayData> {
  const { ai, model } = getGeminiClient();

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
    await reserveProviderRequest();
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: AUVORA_REPLAY_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const content = response.text;
    if (!content || content.trim() === "") {
      throw new Error("AI returned empty replay response content.");
    }

    const parsedJson = JSON.parse(content);
    const replay = AuvoraReplaySchema.parse(parsedJson);

    return replay;
  } catch (err: unknown) {
    if (err instanceof GlobalProviderQuotaExhaustedError || err instanceof GlobalProviderGuardError) {
      throw err;
    }
    if (err instanceof Error) {
      throw new Error(`AI Replay Execution Failed: ${err.message}`);
    }
    throw new Error("AI Replay Execution Failed with an unknown error.");
  }
}

export async function runAuvoraPatternAnalysis(
  input: NormalizedPatternInput
): Promise<AuvoraPatternReportData> {
  const { ai, model } = getGeminiClient();

  const userPrompt = `
Please analyze historical decision patterns across the following dataset of ${input.total_eligible_decisions} decisions:

HISTORICAL DECISION DATASET:
${JSON.stringify(input, null, 2)}
`;

  try {
    await reserveProviderRequest();
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: AUVORA_PATTERN_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const content = response.text;
    if (!content || content.trim() === "") {
      throw new Error("AI returned empty pattern report content.");
    }

    const parsedJson = JSON.parse(content);
    const patternReport = AuvoraPatternReportSchema.parse(parsedJson);

    return patternReport;
  } catch (err: unknown) {
    if (err instanceof GlobalProviderQuotaExhaustedError || err instanceof GlobalProviderGuardError) {
      throw err;
    }
    if (err instanceof Error) {
      throw new Error(`AI Pattern Analysis Execution Failed: ${err.message}`);
    }
    throw new Error("AI Pattern Analysis Execution Failed with an unknown error.");
  }
}
