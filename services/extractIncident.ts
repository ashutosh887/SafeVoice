import { IncidentRecord } from "@/types/incident";

type ExtractionResult = Pick<
  IncidentRecord,
  "summary" | "extracted" | "flags"
>;

const PROMPT = (text: string) => `
You are a trauma-informed legal documentation assistant.

Extract only explicitly stated facts.

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
- If unsure, return null

Narration:
"""${text}"""
`;

async function extractWithGemini(
  transcript: string
): Promise<ExtractionResult | null> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: PROMPT(transcript) }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return null;

  return JSON.parse(text);
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
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You extract structured legal facts from trauma narratives. Output strict JSON only.",
          },
          {
            role: "user",
            content: PROMPT(transcript),
          },
        ],
      }),
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) return null;

  return JSON.parse(text);
}

export async function extractIncidentFromTranscript(
  transcript: string
): Promise<ExtractionResult | null> {
  try {
    return (
      (await extractWithGemini(transcript)) ??
      (await extractWithOpenAI(transcript))
    );
  } catch {
    return null;
  }
}
