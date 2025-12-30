import CircleInherit from "@/components/CircleInherit";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function EndSession() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 items-center justify-center px-6">
        <CircleInherit>
          <Check size={28} color="#16a34a" />
        </CircleInherit>

        <Text className="text-xl mt-8 mb-6 text-center">
          You did the right thing.
        </Text>

        <Pressable
          onPress={() => router.replace("/witness/home")}
          className="bg-black px-6 py-3 rounded-xl w-[200px]"
        >
          <Text className="text-white text-center font-medium">
            Exit safely
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
