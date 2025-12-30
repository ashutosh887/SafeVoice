import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import VoiceCircle from "@/components/VoiceCircle";
import VoiceWave from "@/components/VoiceWave";
import { useMicrophone } from "@/hooks/useMicrophone";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Listen() {
  const router = useRouter();
  const micGranted = useMicrophone();

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
        <VoiceCircle>
          <VoiceWave />
        </VoiceCircle>

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
          className="bg-black px-6 py-3 rounded-xl"
        >
          <Text className="text-white">
            End
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
