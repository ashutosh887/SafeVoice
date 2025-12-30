import { IncidentRecord } from "@/types/incident";

type ExtractionResult = Pick<
  IncidentRecord,
  "summary" | "extracted" | "flags"
>;

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
  transcript: string
): Promise<ExtractionResult | null> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
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

  if (!res.ok) return null;

  const json = await res.json();
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return null;

  return safeJsonParse(text);
}

async function extractWithOpenAI(
  transcript: string
): Promise<ExtractionResult | null> {
  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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

  if (!res.ok) return null;

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) return null;

  return safeJsonParse(text);
}

export async function extractIncidentFromTranscript(
  transcript: string
): Promise<ExtractionResult | null> {
  try {
    const gemini = await extractWithGemini(transcript);
    if (gemini) return gemini;

    return await extractWithOpenAI(transcript);
  } catch {
    return null;
  }
}
