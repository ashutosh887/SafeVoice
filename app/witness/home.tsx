import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl mb-10 text-center">
        I’m here with you.
      </Text>

      <Pressable
        onPress={() => router.push("/session/start")}
        className="bg-black px-8 py-4 rounded-xl"
      >
        <Text className="text-white">🎤 Talk to Witness</Text>
      </Pressable>
    </View>
  );
}
