import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <Text className="text-xl mt-20 mb-10 text-center">
        I’m here with you.
      </Text>

      <Pressable
        onPress={() => router.push("/session/start")}
        className="bg-black px-8 py-4 rounded-xl self-center"
      >
        <Text className="text-white">🎤 Talk to Witness</Text>
      </Pressable>
    </SafeScreen>
  );
}
