import AppLogo from "@/components/AppLogo";
import config from "@/config";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6">
      
      <View className="flex-1 items-center justify-center">
        <Pressable
          onLongPress={() => router.push("/unlock")}
          delayLongPress={800}
          className="mb-8"
        >
          <AppLogo size={120} />
        </Pressable>

        <Text className="text-[28px] font-extrabold text-[#010100] text-center tracking-[-0.5px] mb-3">
          {config.appName}
        </Text>

        <Text className="text-[15px] text-[#101010] text-center leading-[22px] max-w-[300px] mb-10">
          {config.appTagLine}
        </Text>

        <Pressable
          className="bg-[#010100] w-full max-w-[260px] py-4 rounded-xl shadow-lg shadow-black/15 elevation-8"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
          onPress={() => router.push("/meditation")}
        >
          <Text className="text-[#e0e0e0] text-base font-semibold tracking-[0.5px] text-center">
            Get Started
          </Text>
        </Pressable>

      </View>

      <View className="pb-8 items-center">
        <Text className="text-[12px] text-[#101010] text-center">
          Designed & Developed by{" "}
          <Text
            className="text-[#010100] font-semibold"
            onPress={() =>
              Linking.openURL(config.appAuthorUrl)
            }
          >
            {config.appAuthor} 🇮🇳
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Index;
