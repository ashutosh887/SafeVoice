import QuickExit from "@/components/QuickExit";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Unlock() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <QuickExit to="/" />

      <View className="items-center">
        <Text className="text-2xl font-semibold mb-3 text-center">
          Private Access
        </Text>

        <Text className="text-sm text-gray-600 text-center mb-10 max-w-[280px] leading-[20px]">
          This area is designed for private documentation and sensitive use.
          Make sure you’re in a safe and private space.
        </Text>

        <Pressable
          onPress={() => router.replace("/witness/home")}
          className="bg-black px-8 py-4 rounded-xl"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-white text-base font-semibold">
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
