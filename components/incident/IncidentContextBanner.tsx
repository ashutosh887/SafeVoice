import { useIncidentStore } from "@/store/useIncidentStore";
import { Text, View } from "react-native";

export function IncidentContextBanner() {
  const patterns = useIncidentStore((s) => s.patterns);

  return (
    <View>
      <Text className="text-xs text-gray-500 mb-1">Context</Text>
      <Text className="text-sm text-gray-800">
        This is one of {patterns.totalIncidents} recordings.{" "}
        {patterns.frequencyIncreasing
          ? "Incidents are increasing in frequency."
          : "No frequency increase detected."}
      </Text>
    </View>
  );
}
