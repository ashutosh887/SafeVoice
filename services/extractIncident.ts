import { DATADOG_EVENTS } from "@/constants/datadog";
import { logEvent } from "@/lib/observability";
import { IncidentRecord } from "@/types/incident";

type ExtractionResult = Pick<
  IncidentRecord,
  "summary" | "extracted" | "flags"
>;

const GEMINI_MODEL = "gemini-2.5-flash";
const OPENAI_MODEL = "gpt-4o-mini";

const GEMINI_PROMPT = (text: string) => `
You are a legal documentation assistant.

You must ALWAYS return a valid JSON object.
All keys MUST be present.
If information is not explicitly stated, use null.

Task:
- Write a neutral factual summary of what was said.
- Extract facts ONLY if explicitly stated.
- If the content is benign or casual, clearly say so in the summary.

Return EXACTLY this JSON shape:
{
  "summary": string,
  "extracted": {
    "time": string | null,
    "location": string | null,
    "actions": string[] | null,
    "witnesses": string[] | null,
    "childrenPresent": boolean | null,
    "priorIncidents": boolean | null
  },
  "flags": {
    "escalation": boolean | null,
    "imminentRisk": boolean | null
  }
}

Rules:
- Do NOT infer
- Do NOT invent
- Do NOT omit keys
- Use null if not mentioned

Narration:
"""${text}"""
`;

const OPENAI_PROMPT = (text: string) => `
You are a trauma-informed legal documentation assistant.

ALWAYS produce a neutral summary.
Extract facts ONLY if explicitly stated.
If content is benign, clearly say so.

Return STRICT JSON:
{
  "summary": string,
  "extracted": {
    "time": string | null,
    "location": string | null,
    "actions": string[] | null,
    "witnesses": string[] | null,
    "childrenPresent": boolean | null,
    "priorIncidents": boolean | null
  },
  "flags": {
    "escalation": boolean | null,
    "imminentRisk": boolean | null
  }
}

Rules:
- Do not infer
- Do not invent
- Use null when not mentioned

Narration:
"""${text}"""
`;

function safeJsonParse(text: string): ExtractionResult | null {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function extractWithGemini(
  transcript: string,
  incidentId?: string
): Promise<ExtractionResult | null> {
  const startedAt = Date.now();

  logEvent({
    event: DATADOG_EVENTS.EXTRACTION_GEMINI_START,
    incidentId,
    payload: { model: GEMINI_MODEL },
  });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key":
            process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: GEMINI_PROMPT(transcript) }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_GEMINI_ERROR,
        incidentId,
        payload: {
          status: res.status,
          latencyMs,
        },
      });
      return null;
    }

    const json = await res.json();
    const text =
      json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_GEMINI_TEXT_EMPTY,
        incidentId,
        payload: { latencyMs },
      });
      return null;
    }

    const parsed = safeJsonParse(text);
    if (!parsed) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_GEMINI_PARSE_FAILED,
        incidentId,
        payload: { latencyMs },
      });
      return null;
    }

    logEvent({
      event: DATADOG_EVENTS.EXTRACTION_GEMINI_SUCCESS,
      incidentId,
      payload: { latencyMs },
    });

    return parsed;
  } catch (e: any) {
    logEvent({
      event: DATADOG_EVENTS.EXTRACTION_GEMINI_EXCEPTION,
      incidentId,
      payload: { message: e?.message },
    });
    return null;
  }
}

async function extractWithOpenAI(
  transcript: string,
  incidentId?: string
): Promise<ExtractionResult | null> {
  const startedAt = Date.now();

  logEvent({
    event: DATADOG_EVENTS.EXTRACTION_OPENAI_START,
    incidentId,
    payload: { model: OPENAI_MODEL },
  });

  try {
    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          temperature: 0.1,
          messages: [
            {
              role: "system",
              content:
                "Extract explicit facts and return strict JSON only.",
            },
            {
              role: "user",
              content: OPENAI_PROMPT(transcript),
            },
          ],
        }),
      }
    );

    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_OPENAI_ERROR,
        incidentId,
        payload: {
          status: res.status,
          latencyMs,
        },
      });
      return null;
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;

    if (!text) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_OPENAI_EMPTY,
        incidentId,
        payload: { latencyMs },
      });
      return null;
    }

    const parsed = safeJsonParse(text);
    if (!parsed) {
      logEvent({
        event: DATADOG_EVENTS.EXTRACTION_OPENAI_PARSE_FAILED,
        incidentId,
        payload: { latencyMs },
      });
      return null;
    }

    logEvent({
      event: DATADOG_EVENTS.EXTRACTION_OPENAI_SUCCESS,
      incidentId,
      payload: { latencyMs },
    });

    return parsed;
  } catch (e: any) {
    logEvent({
      event: DATADOG_EVENTS.EXTRACTION_OPENAI_EXCEPTION,
      incidentId,
      payload: { message: e?.message },
    });
    return null;
  }
}

export async function extractIncidentFromTranscript(
  transcript: string,
  incidentId?: string
): Promise<ExtractionResult | null> {
  try {
    const gemini = await extractWithGemini(
      transcript,
      incidentId
    );
    if (gemini) return gemini;

    return await extractWithOpenAI(
      transcript,
      incidentId
    );
  } catch {
    return null;
  }
}
