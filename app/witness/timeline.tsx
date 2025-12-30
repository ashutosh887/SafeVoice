import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { FlatList, Text, View } from "react-native";

const DATA = [
  { id: "1", date: "Approx. May", risk: "High" },
  { id: "2", date: "Approx. June", risk: "Medium" },
];

export default function Timeline() {
  return (
    <SafeScreen>
      <QuickExit />

      <View className="px-6 pt-10">
        <Text className="text-xl mb-6">Your Record</Text>

        <FlatList
          data={DATA}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="py-4 border-b border-gray-200">
              <Text className="text-base">{item.date}</Text>
              <Text className="text-xs text-gray-500">
                Risk level: {item.risk}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeScreen>
  );
}
