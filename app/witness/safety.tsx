import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { Text, View } from "react-native";

export default function Safety() {
  return (
    <SafeScreen>
      <QuickExit />

      <View className="px-6 pt-10">
        <Text className="text-xl mb-6">Your Safety</Text>

        <View className="space-y-3">
          <Text>• Emergency contact saved</Text>
          <Text>• Exit plan discussed</Text>
          <Text>• Records backed up</Text>
        </View>
      </View>
    </SafeScreen>
  );
}
