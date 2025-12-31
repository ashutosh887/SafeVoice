import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import * as Linking from "expo-linking";
import { Pressable, Text, View } from "react-native";

export function CrisisOverlay({
  incident,
}: {
  incident: IncidentRecord;
}) {
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );

  const callEmergency = () => {
    Linking.openURL("tel:112");
  };

  const markSafe = () => {
    updateIncident(incident.id, {
      crisis: {
        ...incident.crisis,
        detected: false,
        resolvedAt: Date.now(),
      },
    });
  };

  return (
    <View className="border border-red-300 bg-red-50 rounded-xl p-4 gap-3">
      <Text className="text-sm font-semibold text-red-800">
        Immediate danger detected
      </Text>

      <Text className="text-xs text-red-700">
        It sounds like you may be in danger right now.
        Your safety comes first.
      </Text>

      <Pressable
        onPress={callEmergency}
        className="bg-red-600 rounded-lg py-3"
      >
        <Text className="text-white text-center text-sm font-medium">
          Call emergency services
        </Text>
      </Pressable>

      <Pressable
        onPress={markSafe}
        className="border border-red-400 rounded-lg py-3"
      >
        <Text className="text-red-700 text-center text-sm font-medium">
          I’m safe right now
        </Text>
      </Pressable>

      <Text className="text-xs text-red-600">
        If you cannot call, try to move to a safer place
        or reach out to someone you trust.
      </Text>
    </View>
  );
}
