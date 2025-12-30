import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function StartSession() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <Text className="text-center mt-20 mb-6 px-6">
        You can stop anytime. Nothing is stored on your phone.
      </Text>

      <Pressable
        onPress={() => router.replace("/session/listen")}
        className="bg-black px-6 py-3 rounded-xl self-center"
      >
        <Text className="text-white">Start</Text>
      </Pressable>
    </SafeScreen>
  );
}
