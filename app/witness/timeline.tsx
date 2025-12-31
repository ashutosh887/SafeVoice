import { IncidentModal } from "@/components/incident/IncidentModal";
import IncidentPatternInsight from "@/components/incident/IncidentPatternInsight";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import * as Haptics from "expo-haptics";
import {
  AlertTriangle,
  ShieldAlert,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Timeline() {
  const incidents = useIncidentStore((s) => s.incidents);
  const patterns = useIncidentStore((s) => s.patterns);
  const hydrate = useIncidentStore((s) => s.hydrate);
  const removeIncident = useIncidentStore((s) => s.removeIncident);

  const [selected, setSelected] =
    useState<IncidentRecord | null>(null);

  useEffect(() => {
    hydrate();
  }, []);

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete recording?",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
            removeIncident(id);
          },
        },
      ]
    );
  };

  const riskColor =
    patterns.riskLevel === "high"
      ? "text-red-600"
      : patterns.riskLevel === "medium"
      ? "text-yellow-600"
      : "text-green-600";

  const Header = (
    <View className="mb-2">
      <Text className={`text-sm ${riskColor}`}>
        Overall risk level:{" "}
        {patterns.riskLevel.toUpperCase()}
      </Text>

      {patterns.frequencyIncreasing && (
        <Text className="text-xs text-red-600 mt-1">
          Incidents are increasing in frequency
        </Text>
      )}
    </View>
  );

  return (
    <SafeScreen>
      <QuickExit />

      <FlatList
        data={incidents}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 32,
        }}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-24">
            No recordings yet
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            className="bg-white rounded-2xl border border-gray-200 p-4"
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-gray-800">
                Voice Recording
              </Text>

              {item.flags?.imminentRisk && (
                <ShieldAlert size={16} color="#dc2626" />
              )}

              {!item.flags?.imminentRisk &&
                item.flags?.escalation && (
                  <AlertTriangle
                    size={16}
                    color="#f59e0b"
                  />
                )}
            </View>

            <Text className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            {item.summary && (
              <Text className="text-sm text-gray-700 mt-2">
                {item.summary}
              </Text>
            )}

            <IncidentPatternInsight
              incidentId={item.id}
            />

            <Pressable
              onPress={() => confirmDelete(item.id)}
              hitSlop={12}
              className="absolute right-4 top-4"
            >
              <Trash2 size={18} color="#6b7280" />
            </Pressable>
          </Pressable>
        )}
      />

      <IncidentModal
        incident={selected}
        onClose={() => setSelected(null)}
      />
    </SafeScreen>
  );
}
