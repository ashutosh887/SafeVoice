import { Audio } from "expo-av";
import { useRef, useState } from "react";

export function useAudioRecorder() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const busyRef = useRef(false);
  const meterIntervalRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [level, setLevel] = useState(0);

  const startRecording = async () => {
    if (busyRef.current || recordingRef.current) return;
    busyRef.current = true;

    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      busyRef.current = false;
      throw new Error("Microphone permission not granted");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();

    await recording.prepareToRecordAsync({
      android: {
        extension: ".m4a",
        outputFormat:
          Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder:
          Audio.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        isMeteringEnabled: true,
      },
      ios: {
        extension: ".m4a",
        audioQuality:
          Audio.IOSAudioQuality.HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {},
      isMeteringEnabled: true,
    } as Audio.RecordingOptions);

    await recording.startAsync();

    recordingRef.current = recording;
    setIsRecording(true);

    meterIntervalRef.current = setInterval(async () => {
      const status = await recording.getStatusAsync();
      if (
        !status.isRecording ||
        typeof status.metering !== "number"
      )
        return;

      const normalized = Math.min(
        Math.max((status.metering + 60) / 60, 0),
        1
      );

      setLevel(normalized);
    }, 100);

    busyRef.current = false;
  };

  const stopRecording = async (): Promise<string | null> => {
    if (busyRef.current || !recordingRef.current) return null;
    busyRef.current = true;

    if (meterIntervalRef.current !== null) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }

    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();

    recordingRef.current = null;
    setIsRecording(false);
    setLevel(0);
    busyRef.current = false;

    return uri ?? null;
  };

  return {
    isRecording,
    level,
    startRecording,
    stopRecording,
  };
}
