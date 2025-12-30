import CircleInherit from "@/components/CircleInherit";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 items-center justify-center px-6">
        <CircleInherit size="sm">
          <Mic size={22} color="#52525b" />
        </CircleInherit>

        <Text className="text-lg mt-8 mb-8 text-center">
          I’m here with you.
        </Text>

        <Pressable
          onPress={() => router.push("/session/start")}
          className="bg-black px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-medium">
            Talk to Witness
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
