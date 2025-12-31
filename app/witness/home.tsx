import Logo from "@/components/AppLogo";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import config from "@/config";
import { useRouter } from "expo-router";
import { FileText, Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 px-6">
        <View
          style={{
            marginTop: 12,
            marginBottom: 28,
          }}
        >
          <View className="flex-row items-center">
            <Logo size={28} />
            <Text className="ml-3 text-lg font-medium">{config.appName}</Text>
          </View>

          <Text className="text-sm text-gray-600 mt-2">
            A private space to record events safely.{" "}
          </Text>
        </View>

        <View className="mb-6">
          <Pressable
            onPress={() => router.push("/session/start")}
            className="rounded-2xl border border-gray-300 bg-white p-5"
          >
            <View className="flex-row items-center mb-3">
              <Mic size={18} color="#18181b" />
              <Text className="ml-3 text-base font-medium">
                Talk to {config.appName}
              </Text>
            </View>

            <Text className="text-sm text-gray-600">
              Speak freely. Your voice will be recorded and organized privately.
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/witness/prepare")}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
        >
          <View className="flex-row items-center mb-3">
            <FileText size={16} color="#52525b" />
            <Text className="ml-3 text-sm font-medium">
              Prepare documentation
            </Text>
          </View>

          <Text className="text-xs text-gray-600">
            Review and export your recordings if you decide to share them.
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
