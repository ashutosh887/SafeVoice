export async function transcribeAudio(uri: string): Promise<string> {
    const formData = new FormData();
  
    formData.append("file", {
      uri,
      name: "audio.m4a",
      type: "audio/m4a",
    } as any);
  
    formData.append("model", "whisper-1");
  
    const res = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
  
    if (!res.ok) {
      throw new Error("Transcription failed");
    }
  
    const json = await res.json();
    return json.text ?? "";
  }
  