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
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type ListenState = "idle" | "listening" | "stopped";

export default function Listen() {
  const router = useRouter();
  const micGranted = useMicrophone();

  const { startRecording, stopRecording, level } =
    useAudioRecorder();

  const addIncident = useIncidentStore(
    (s) => s.addIncident
  );

  const [listenState, setListenState] =
    useState<ListenState>("idle");

  const handleWavePress = async () => {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    if (listenState === "idle") {
      await startRecording();
      setListenState("listening");
      return;
    }

    if (listenState === "listening") {
      await stopRecording();

      const incident: IncidentRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
        narrative: "Voice note recorded",
        extracted: {},
        flags: {},
      };

      addIncident(incident);
      setListenState("stopped");
      return;
    }

    if (listenState === "stopped") {
      await startRecording();
      setListenState("listening");
    }
  };

  if (micGranted === false) {
    return (
      <SafeScreen>
        <QuickExit />
        <Text className="mt-24 text-center text-sm text-gray-500">
          Microphone access is required
        </Text>
      </SafeScreen>
    );
  }

  if (micGranted === null) {
    return (
      <SafeScreen>
        <Text className="mt-24 text-center text-sm text-gray-500">
          Preparing microphone…
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
            state={listenState}
            level={level}
            onPress={handleWavePress}
          />
        </CircleInherit>

        <Text className="mt-6 text-sm text-gray-500">
          {listenState === "idle" && "Tap to start recording"}
          {listenState === "listening" && "Listening… tap to stop"}
          {listenState === "stopped" && "Saved"}
        </Text>

        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
            router.replace("/session/end");
          }}
          className="bg-black px-6 py-3 rounded-xl w-[200px] mt-12"
        >
          <Text className="text-white text-center font-medium">
            End
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
