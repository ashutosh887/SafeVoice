import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Unlock() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl mb-6">Private Access</Text>

      <Pressable
        onPress={() => router.replace("/witness/home")}
        className="bg-black px-6 py-3 rounded-xl"
      >
        <Text className="text-white">Continue</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/")}
        className="absolute top-12 right-6"
      >
        <Text className="text-gray-400">Exit</Text>
      </Pressable>
    </View>
  );
}
