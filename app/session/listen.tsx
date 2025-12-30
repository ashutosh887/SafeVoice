import CircleInherit from "@/components/CircleInherit";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import VoiceWave from "@/components/VoiceWave";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useMicrophone } from "@/hooks/useMicrophone";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

type ListenState = "idle" | "listening" | "saved";

export default function Listen() {
  const router = useRouter();
  const micGranted = useMicrophone();
  const { startRecording, stopRecording, level } = useAudioRecorder();
  const addIncident = useIncidentStore((s) => s.addIncident);

  const [state, setState] = useState<ListenState>("idle");
  const pressLockRef = useRef(false);

  const saveAndStop = async () => {
    const uri = await stopRecording();
    if (!uri) return;

    const incident: IncidentRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      narrative: "Voice recording",
      audioUri: uri,
      extracted: {},
      flags: {},
    };

    addIncident(incident);
    setState("saved");
  };

  const handleWavePress = async () => {
    if (pressLockRef.current) return;
    pressLockRef.current = true;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (state === "idle" || state === "saved") {
        setState("listening");
        await startRecording();
        return;
      }

      if (state === "listening") {
        await saveAndStop();
      }
    } finally {
      pressLockRef.current = false;
    }
  };

  if (micGranted !== true) {
    return (
      <SafeScreen>
        <QuickExit />
        <Text className="mt-24 text-center text-sm text-gray-500">
          Microphone access required
        </Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 items-center justify-center px-6">
        <CircleInherit size="lg">
          <VoiceWave
            size="lg"
            state={state === "saved" ? "stopped" : state}
            level={level}
            onPress={handleWavePress}
          />
        </CircleInherit>

        <Text className="mt-6 text-sm text-gray-500 text-center">
          {state === "idle" && "Tap to start recording"}
          {state === "listening" && "Listening… tap to stop"}
          {state === "saved" && "Saved · Tap to record again"}
        </Text>

        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Medium
            );
            if (state === "listening") {
              await saveAndStop();
            }
            router.replace("/session/end");
          }}
          className="bg-black px-6 py-3 rounded-xl w-[200px] mt-12"
        >
          <Text className="text-white text-center font-medium">
            End Session
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
