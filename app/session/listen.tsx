import CircleInherit from "@/components/CircleInherit";
import CrisisOverlay from "@/components/CrisisOverlay";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import VoiceWave from "@/components/VoiceWave";
import { useCrisisDetector } from "@/hooks/useCrisisDetector";
import { useMicrophone } from "@/hooks/useMicrophone";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Listen() {
  const router = useRouter();
  const micGranted = useMicrophone();

  const [mockText, setMockText] = useState<string | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);

  const crisis = useCrisisDetector(mockText);

  useEffect(() => {
    if (crisis) setShowCrisis(true);
  }, [crisis]);

  const resetCrisis = () => {
    setShowCrisis(false);
    setMockText(null);
  };

  if (micGranted === false) {
    return (
      <SafeScreen>
        <QuickExit />
        <Text className="mt-24 text-center">
          Microphone access is required.
        </Text>
      </SafeScreen>
    );
  }

  if (micGranted === null) {
    return (
      <SafeScreen>
        <Text className="mt-24 text-center">
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
            onPress={() => setMockText("he's here help")}
          />
        </CircleInherit>

        <Text className="text-gray-500 mt-6 mb-10">
          Listening…
        </Text>

        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
            router.replace("/session/end");
          }}
          className="bg-black px-6 py-3 rounded-xl w-[200px]"
        >
          <Text className="text-white text-center font-medium">
            End
          </Text>
        </Pressable>
      </View>

      <CrisisOverlay
        visible={showCrisis}
        onContinue={resetCrisis}
      />
    </SafeScreen>
  );
}
