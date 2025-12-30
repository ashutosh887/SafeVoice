import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Listen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <Text className="mt-24 mb-6 text-center text-gray-500">
        Listening…
      </Text>

      <Text className="text-center mb-10">〰️〰️〰️</Text>

      <Pressable
        onPress={() => router.replace("/session/end")}
        className="bg-black px-6 py-3 rounded-xl self-center"
      >
        <Text className="text-white">End</Text>
      </Pressable>
    </SafeScreen>
  );
}
