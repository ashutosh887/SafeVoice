import { playAudio } from "@/lib/audioPlayback";
import { Pause, Play } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text } from "react-native";

type PlayerControls = {
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
};

export function IncidentAudioPlayer({
  audioUri,
}: {
  audioUri: string;
}) {
  const playerRef = useRef<PlayerControls | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current = null;
      }
    };
  }, []);

  const toggle = async () => {
    if (!playerRef.current) {
      playerRef.current = await playAudio(audioUri);
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

  return (
    <Pressable
      onPress={toggle}
      className="bg-black rounded-xl py-3 mb-4 flex-row items-center justify-center gap-2"
    >
      {playing ? (
        <Pause size={20} color="#ffffff" />
      ) : (
        <Play size={20} color="#ffffff" />
      )}
      <Text className="text-white font-medium">
        {playing ? "Pause" : "Play"}
      </Text>
    </Pressable>
  );
}
