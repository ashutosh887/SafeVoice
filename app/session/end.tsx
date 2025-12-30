import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function EndSession() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <Text className="text-xl mt-24 mb-6 text-center">
        You did the right thing.
      </Text>

      <Pressable
        onPress={() => router.replace("/witness/home")}
        className="bg-black px-6 py-3 rounded-xl self-center"
      >
        <Text className="text-white">Exit safely</Text>
      </Pressable>
    </SafeScreen>
  );
}
