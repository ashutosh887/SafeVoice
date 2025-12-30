import { stopActivePlayback } from "@/lib/audioPlayback";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

let globalRecording: Audio.Recording | null = null;
let globalPreparing = false;

export function useAudioRecorder() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
        globalRecording = null;
      }
    };
  }, []);

  const startRecording = async () => {
    if (globalPreparing || globalRecording) return;

    globalPreparing = true;

    try {
      await stopActivePlayback();

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const recording = new Audio.Recording();

      recording.setOnRecordingStatusUpdate((s) => {
        if (s.metering != null) {
          setLevel(Math.max(0, s.metering + 60) / 60);
        }
      });

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await recording.startAsync();

      recordingRef.current = recording;
      globalRecording = recording;
    } catch {
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch {}
        recordingRef.current = null;
        globalRecording = null;
      }
    } finally {
      globalPreparing = false;
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return null;

    const rec = recordingRef.current;
    recordingRef.current = null;
    globalRecording = null;

    try {
      await rec.stopAndUnloadAsync();
      setLevel(0);
      return rec.getURI();
    } catch {
      return null;
    }
  };

  return { startRecording, stopRecording, level };
}
