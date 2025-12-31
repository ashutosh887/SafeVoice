import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { resetPin } from "@/lib/security";
import { useRouter } from "expo-router";
import { AlertCircle, LifeBuoy, ShieldAlert } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function Support() {
  const router = useRouter();

  const onResetPin = async () => {
    await resetPin();
    router.replace("/unlock");
  };

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 px-6">
        <View className="mt-4 mb-8">
          <Text className="text-lg font-medium">Support</Text>
          <Text className="text-sm text-gray-600 mt-2 max-w-[90%]">
            Access help resources and manage safety settings.
          </Text>
        </View>

        <View>
          <View className="rounded-t-2xl border border-gray-300 bg-white p-5">
            <View className="flex-row items-center mb-2">
              <LifeBuoy size={17} color="#18181b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-900">
                Get help
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              Find legal aid, emergency helplines, and nearby shelters if you need
              immediate or long-term support.
            </Text>
          </View>

          <View className="border border-t-0 border-gray-300 bg-gray-50 p-5">
            <View className="flex-row items-center mb-2">
              <ShieldAlert size={17} color="#52525b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-800">
                Security
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              Manage access to your private space and reset your PIN if required.
            </Text>
          </View>

          <Pressable
            onPress={onResetPin}
            className="rounded-b-2xl border border-t-0 border-red-200 bg-white p-5"
          >
            <View className="flex-row items-center mb-2">
              <AlertCircle size={17} color="#dc2626" />
              <Text className="ml-3 text-[15px] font-medium text-red-600">
                Reset PIN
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              This will remove your current PIN and require you to set a new one
              before accessing protected areas.
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
}
