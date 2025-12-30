import VoiceCircle from "@/components/CircleInherit";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function StartSession() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 items-center justify-center px-6">
        <VoiceCircle>
          <Mic size={22} color="#52525b" />
        </VoiceCircle>

        <Text className="text-gray-500 mt-8 mb-10 text-center">
          Speak when you’re ready.
          {"\n"}
          You’re in control the whole time.
        </Text>

        <Pressable
          onPress={() => router.replace("/session/listen")}
          className="bg-black px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-medium">
            Start
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
