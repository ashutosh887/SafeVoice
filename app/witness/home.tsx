import Logo from "@/components/AppLogo";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import config from "@/config";
import { useRouter } from "expo-router";
import { FileText, Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 px-6">
        <View className="mt-4 mb-8">
          <View className="flex-row items-center">
            <Logo size={28} />
            <Text className="ml-3 text-lg font-medium">
              {config.appName}
            </Text>
          </View>

          <Text className="text-sm text-gray-600 mt-3 max-w-[90%]">
            A private space to record events safely.
          </Text>
        </View>

        <View>
          <Pressable
            onPress={() => router.push("/session/start")}
            className="rounded-t-2xl border border-gray-300 bg-white p-5"
          >
            <View className="flex-row items-center mb-2">
              <Mic size={17} color="#18181b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-900">
                Talk to {config.appName}
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5 max-w-[95%]">
              Speak freely. Your voice will be recorded and organized privately.
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/witness/prepare")}
            className="rounded-b-2xl border border-t-0 border-gray-300 bg-gray-50 p-5"
          >
            <View className="flex-row items-center mb-2">
              <FileText size={17} color="#52525b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-800">
                Prepare documentation
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5 max-w-[95%]">
              Review and export your recordings if you decide to share them.
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
}
