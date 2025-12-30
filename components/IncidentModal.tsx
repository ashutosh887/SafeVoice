import { playAudio } from "@/lib/audioPlayback";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

type PlayerControls = {
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
};

export function IncidentModal({
  incident,
  onClose,
}: {
  incident: IncidentRecord | null;
  onClose: () => void;
}) {
  const updateIncident = useIncidentStore((s) => s.updateIncident);

  const playerRef = useRef<PlayerControls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current = null;
      }
    };
  }, []);

  if (!incident) return null;

  const handlePlayPause = async () => {
    if (!playerRef.current) {
      const controls = await playAudio(incident.audioUri);
      playerRef.current = controls;
      setPlaying(true);
      return;
    }

    if (playing) {
      await playerRef.current.pause();
      setPlaying(false);
    } else {
      await playerRef.current.resume();
      setPlaying(true);
    }
  };

  const handleClose = async () => {
    if (playerRef.current) {
      await playerRef.current.stop();
      playerRef.current = null;
    }
    setPlaying(false);
    onClose();
  };

  const transcribe = async () => {
    if (incident.transcript || loading) return;

    try {
      setLoading(true);
      setError(null);

      const form = new FormData();
      form.append("file", {
        uri: incident.audioUri,
        name: "audio.m4a",
        type: "audio/m4a",
      } as any);
      form.append("model", "whisper-1");

      const res = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
          },
          body: form,
        }
      );

      const json = await res.json();
      if (!json.text) throw new Error();

      updateIncident({
        ...incident,
        transcript: json.text,
      });
    } catch {
      setError("Could not transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center px-6">
        <View className="bg-white rounded-3xl p-6 max-h-[80%]">
          <Text className="text-lg font-medium mb-4">
            Recorded Entry
          </Text>

          <Pressable
            onPress={handlePlayPause}
            className="bg-black rounded-xl py-3 mb-4"
          >
            <Text className="text-white text-center font-medium">
              {playing ? "⏸ Pause" : "▶ Play"}
            </Text>
          </Pressable>

          <View className="border border-gray-200 rounded-xl p-4 min-h-[120px]">
            {incident.transcript ? (
              <Text className="text-sm text-gray-800">
                {incident.transcript}
              </Text>
            ) : loading ? (
              <View className="items-center justify-center">
                <ActivityIndicator />
                <Text className="text-xs text-gray-500 mt-2">
                  Transcribing…
                </Text>
              </View>
            ) : (
              <Pressable onPress={transcribe}>
                <Text className="text-sm text-blue-600 text-center">
                  Transcribe recording
                </Text>
              </Pressable>
            )}
          </View>

          {error && (
            <Text className="text-xs text-red-500 mt-3">
              {error}
            </Text>
          )}

          <Pressable
            onPress={handleClose}
            className="self-end mt-6"
          >
            <Text className="text-sm text-gray-600">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
