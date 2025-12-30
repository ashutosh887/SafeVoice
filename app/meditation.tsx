import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Meditation = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-semibold mb-4">
        Take a moment
      </Text>

      <Text className="text-base text-gray-600 text-center mb-12 leading-[22px]">
        Breathe in slowly.{"\n"}
        Breathe out gently.
      </Text>

      <View className="w-32 h-32 rounded-full bg-gray-200 mb-12" />

      <Pressable
        onPress={() => router.back()}
        className="px-6 py-3 rounded-xl bg-black"
      >
        <Text className="text-white font-medium">
          Done
        </Text>
      </Pressable>
    </View>
  );
};

export default Meditation;
