import config from "@/config";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";

const Index = () => {
  return (
    <View className="flex-1 px-6 items-center justify-center bg-white">
      <Image
        source={require("@/assets/images/logo.jpeg")}
        resizeMode="contain"
        className="w-[120px] h-[120px] mb-8"
      />

      <Text className="text-[28px] font-extrabold text-[#010100] text-center mb-2 tracking-[-0.5px]">
        {config.appName}
      </Text>

      <Text className="text-base text-[#101010] text-center mb-12 leading-[22px] max-w-[280px]">
        {config.appTagLine}
      </Text>

      <Pressable
        className="bg-[#010100] px-8 py-4 rounded-xl shadow-lg shadow-black/15 elevation-8"
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Text className="text-[#e0e0e0] text-base font-semibold tracking-[0.5px] text-center">
          Get Started
        </Text>
      </Pressable>

      <View className="absolute bottom-8">
        <Text className="text-xs text-[#101010] text-center">
          Designed & Developed by{" "}
          <Text
            className="text-[#010100] font-semibold"
            onPress={() =>
              Linking.openURL("https://github.com/ashutosh887")
            }
          >
            ashutosh887 🇮🇳
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Index;
