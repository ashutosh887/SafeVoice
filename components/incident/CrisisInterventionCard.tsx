import { useIncidentStore } from "@/store/useIncidentStore";
import { Pressable, Text, View } from "react-native";

export function CrisisInterventionCard({
  incidentId,
}: {
  incidentId: string;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );

  if (!incident?.crisis?.detected) return null;
  if (incident.crisis.acknowledged) return null;

  const acknowledge = (
    action: "called_help" | "dismissed"
  ) => {
    updateIncident(incident.id, {
      crisis: {
        ...incident.crisis!,
        acknowledged: true,
        resolvedAt: Date.now(),
        resolutionAction: action,
      },
    });
  };

  return (
    <View className="mt-4 p-4 border border-red-300 rounded-xl bg-red-50">
      <Text className="text-sm font-medium mb-2 text-red-800">
        You may be in immediate danger
      </Text>

      <Text className="text-xs text-red-700 mb-3">
        If you are unsafe right now, consider contacting
        emergency services or a trusted person.
      </Text>

      <View className="flex-row gap-3">
        <Pressable
          className="px-4 py-2 bg-red-600 rounded-lg"
          onPress={() => acknowledge("called_help")}
        >
          <Text className="text-white">
            I’ll get help now
          </Text>
        </Pressable>

        <Pressable
          className="px-4 py-2 border rounded-lg"
          onPress={() => acknowledge("dismissed")}
        >
          <Text>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}
