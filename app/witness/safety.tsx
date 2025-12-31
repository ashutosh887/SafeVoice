import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { CheckCircle, ShieldCheck, UploadCloud } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Safety() {
  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 px-6">
        <View className="mt-4 mb-8">
          <Text className="text-lg font-medium">Your safety</Text>
          <Text className="text-sm text-gray-600 mt-2 max-w-[90%]">
            An overview of the steps you’ve taken to protect yourself and your
            records.
          </Text>
        </View>

        <View>
          <View className="rounded-t-2xl border border-gray-300 bg-white p-5">
            <View className="flex-row items-center mb-2">
              <ShieldCheck size={17} color="#18181b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-900">
                Emergency readiness
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              You’ve identified emergency contacts and discussed an exit plan in
              case you need to leave quickly.
            </Text>
          </View>

          <View className="border border-t-0 border-gray-300 bg-gray-50 p-5">
            <View className="flex-row items-center mb-2">
              <CheckCircle size={17} color="#52525b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-800">
                Documentation status
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              Your records are safely stored on this device and organized for
              future access.
            </Text>
          </View>

          <View className="rounded-b-2xl border border-t-0 border-gray-300 bg-white p-5">
            <View className="flex-row items-center mb-2">
              <UploadCloud size={17} color="#52525b" />
              <Text className="ml-3 text-[15px] font-medium text-gray-800">
                Backup awareness
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              You can export or back up selected records whenever you decide it’s
              safe to do so.
            </Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
