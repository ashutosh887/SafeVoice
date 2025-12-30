import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function EndSession() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-xl mb-6 text-center">
        You did the right thing.
      </Text>

      <Pressable
        onPress={() => router.replace("/witness/home")}
        className="bg-black px-6 py-3 rounded-xl"
      >
        <Text className="text-white">Exit safely</Text>
      </Pressable>
    </View>
  );
}
