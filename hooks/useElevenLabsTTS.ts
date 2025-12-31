import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { useRef } from "react";

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export function useElevenLabsTTS() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const speak = async (text: string) => {
    try {
      await stop();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_KEY!,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
          }),
        }
      );

      if (!res.ok) return;

      const audioUri = FileSystem.cacheDirectory + "elevenlabs_tts.mp3";
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      await FileSystem.writeAsStringAsync(audioUri, base64);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      soundRef.current = sound;
    } catch {}
  };

  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  return { speak, stop };
}
