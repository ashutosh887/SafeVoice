import { logEvent } from "@/lib/observability";
import { IncidentRecord } from "@/types/incident";

export type GeminiInsights = {
  patternSummary: string;
  riskExplanation: string;
};

const MODEL = "gemini-2.5-flash";

const PROMPT = (incident: IncidentRecord) => `
You are a safety analyst assisting with legal documentation.

Analyze the following incident data and explain:
1. Overall risk level reasoning
2. Any escalation or pattern indicators

Use neutral, factual language.
Do not speculate.
Do not give advice.

Return STRICT JSON:
{
  "patternSummary": string,
  "riskExplanation": string
}

Incident data:
${JSON.stringify(
  {
    narrative: incident.combinedNarrative,
    extracted: incident.extracted,
    flags: incident.flags,
    patterns: incident.patterns,
  },
  null,
  2
)}
`;

export async function getGeminiInsights(
  incident: IncidentRecord
): Promise<GeminiInsights | null> {
  if (!incident.combinedNarrative) return null;

  const startedAt = Date.now();

  logEvent({
    event: "gemini.insights.start",
    incidentId: incident.id,
    payload: {
      model: MODEL,
    },
  });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
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
              parts: [{ text: PROMPT(incident) }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      logEvent({
        event: "gemini.insights.error",
        incidentId: incident.id,
        payload: {
          model: MODEL,
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
        event: "gemini.insights.empty",
        incidentId: incident.id,
        payload: {
          model: MODEL,
          latencyMs,
        },
      });
      return null;
    }

    const parsed = JSON.parse(
      text.replace(/```json|```/g, "").trim()
    );

    logEvent({
      event: "gemini.insights.success",
      incidentId: incident.id,
      payload: {
        model: MODEL,
        latencyMs,
      },
    });

    return parsed;
  } catch (error: any) {
    logEvent({
      event: "gemini.insights.exception",
      incidentId: incident.id,
      payload: {
        model: MODEL,
        message: error?.message,
      },
    });
    return null;
  }
}
