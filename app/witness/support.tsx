import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { Text, View } from "react-native";

export default function Support() {
  return (
    <SafeScreen>
      <QuickExit />

      <View className="px-6 pt-10">
        <Text className="text-xl mb-6">Support</Text>

        <View className="space-y-3">
          <Text>Legal aid</Text>
          <Text>Helplines</Text>
          <Text>Shelters</Text>
        </View>
      </View>
    </SafeScreen>
  );
}
