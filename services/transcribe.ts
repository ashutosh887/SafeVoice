import { logEvent } from "@/lib/observability";

export async function transcribeAudio(
  uri: string,
  incidentId?: string
): Promise<string> {
  const startTs = Date.now();

  logEvent({
    event: "transcription.start",
    incidentId,
  });

  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "audio.m4a",
    type: "audio/m4a",
  } as any);

  formData.append("model", "whisper-1");
  formData.append("language", "en");
  formData.append(
    "prompt",
    "This is an English narration of an incident. Transcribe in English only."
  );

  try {
    const res = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
        },
        body: formData,
      }
    );

    const latencyMs = Date.now() - startTs;

    if (!res.ok) {
      logEvent({
        event: "transcription.error",
        incidentId,
        payload: { status: res.status, latencyMs },
      });
      throw new Error("Transcription failed");
    }

    const json = await res.json();

    logEvent({
      event: "transcription.success",
      incidentId,
      payload: { latencyMs },
    });

    return json.text ?? "";
  } catch (e: any) {
    logEvent({
      event: "transcription.exception",
      incidentId,
      payload: { message: e?.message },
    });
    throw e;
  }
}
