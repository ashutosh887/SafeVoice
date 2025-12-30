import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import VoiceCircle from "@/components/VoiceCircle";
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

        <Text className="text-gray-500 mt-6 mb-2 text-center">
          We’ll listen when you’re ready.
        </Text>

        <Text className="text-center mb-8">
          You can stop anytime. Nothing is stored on your phone.
        </Text>

        <Pressable
          onPress={() => router.replace("/session/listen")}
          className="bg-black px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-medium">
            Start
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
