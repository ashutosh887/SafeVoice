import { FlatList, Text, View } from "react-native";

const DATA = [
  { id: "1", label: "Approx. May — High risk" },
  { id: "2", label: "Approx. June — Medium risk" },
];

export default function Timeline() {
  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="text-xl mb-6">Your Record</Text>

      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Text className="py-4 border-b">{item.label}</Text>
        )}
      />
    </View>
  );
}
