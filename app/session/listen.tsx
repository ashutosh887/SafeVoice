import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Listen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-6">Listening…</Text>
      <Text className="mb-10">〰️〰️〰️</Text>

      <Pressable
        onPress={() => router.replace("/session/end")}
        className="bg-black px-6 py-3 rounded-xl"
      >
        <Text className="text-white">End</Text>
      </Pressable>
    </View>
  );
}
