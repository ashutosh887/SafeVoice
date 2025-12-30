import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function StartSession() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-center mb-6">
        You can stop anytime. Nothing is stored on your phone.
      </Text>

      <Pressable
        onPress={() => router.replace("/session/listen")}
        className="bg-black px-6 py-3 rounded-xl"
      >
        <Text className="text-white">Start</Text>
      </Pressable>
    </View>
  );
}
