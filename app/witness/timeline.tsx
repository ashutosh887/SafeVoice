import { IncidentModal } from "@/components/incident/IncidentModal";
import IncidentPatternInsight from "@/components/incident/IncidentPatternInsight";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { exportIncidentReport } from "@/lib/exportIncidentReport";
import { useIncidentStore } from "@/store/useIncidentStore";
import { RiskLevel } from "@/types/incident";
import { File, Paths } from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import {
  AlertTriangle,
  ShieldAlert,
  Trash2,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Timeline() {
  const incidents = useIncidentStore((s) => s.incidents);
  const hydrate = useIncidentStore((s) => s.hydrate);
  const removeIncident = useIncidentStore(
    (s) => s.removeIncident
  );

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, []);

  const overallRisk: RiskLevel = useMemo(() => {
    if (
      incidents.some(
        (i) =>
          i.crisis?.detected ||
          i.flags?.imminentRisk
      )
    )
      return "high";

    if (
      incidents.some(
        (i) =>
          i.flags?.escalation ||
          i.patterns?.riskLevel === "medium"
      )
    )
      return "medium";

    return "low";
  }, [incidents]);

  const frequencyIncreasing = useMemo(() => {
    if (incidents.length < 3) return false;

    const sorted = [...incidents].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return (
      sorted[0].createdAt -
        sorted[2].createdAt <
      1000 * 60 * 60 * 24
    );
  }, [incidents]);

  const exportReport = async () => {
    if (!incidents.length) return;

    const report = exportIncidentReport(incidents);

    const file = new File(
      Paths.cache,
      `incident-report-${Date.now()}.txt`
    );

    await file.write(report);
    await Sharing.shareAsync(file.uri);
  };

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
    overallRisk === "high"
      ? "text-red-600"
      : overallRisk === "medium"
      ? "text-yellow-600"
      : "text-green-600";

  const Header = (
    <View className="px-6 pt-4 pb-4">
      <Text className="text-lg font-medium mb-1">
        Timeline
      </Text>

      <Text className={`text-sm ${riskColor}`}>
        Overall risk level: {overallRisk.toUpperCase()}
      </Text>

      {frequencyIncreasing && (
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
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: 96 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-24">
            No recordings yet
          </Text>
        }
        renderItem={({ item }) => (
          <View className="px-6 mb-3">
            <Pressable
              onPress={() =>
                setSelectedId(item.id)
              }
              className="rounded-xl border border-gray-300 bg-white p-4"
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[14px] font-medium text-gray-900">
                  Voice recording
                </Text>

                {item.flags?.imminentRisk && (
                  <ShieldAlert
                    size={15}
                    color="#dc2626"
                  />
                )}

                {!item.flags?.imminentRisk &&
                  item.flags?.escalation && (
                    <AlertTriangle
                      size={15}
                      color="#f59e0b"
                    />
                  )}
              </View>

              <Text className="text-xs text-gray-500">
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </Text>

              {item.summary && (
                <Text className="text-sm text-gray-700 mt-1 leading-5">
                  {item.summary}
                </Text>
              )}

              <View className="mt-2">
                <IncidentPatternInsight
                  incidentId={item.id}
                />
              </View>

              <Pressable
                onPress={() =>
                  confirmDelete(item.id)
                }
                hitSlop={10}
                className="absolute right-3 top-3"
              >
                <Trash2
                  size={15}
                  color="#6b7280"
                />
              </Pressable>
            </Pressable>
          </View>
        )}
      />

      {incidents.length > 0 && (
        <Pressable
          onPress={exportReport}
          className="absolute bottom-6 left-6 right-6 rounded-xl bg-black py-3"
        >
          <Text className="text-center text-white font-medium">
            Export incident record
          </Text>
        </Pressable>
      )}

      <IncidentModal
        incidentId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </SafeScreen>
  );
}
