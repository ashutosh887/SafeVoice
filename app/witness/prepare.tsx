import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { exportIncidentReport } from "@/lib/exportIncidentReport";
import { useIncidentStore } from "@/store/useIncidentStore";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { Pressable, Text, View } from "react-native";

export default function PrepareDocumentation() {
  const incidents = useIncidentStore((s) => s.incidents);
  const patterns = useIncidentStore((s) => s.patterns);

  const exportDocs = async () => {
    if (!incidents.length) return;

    const report = exportIncidentReport(
      incidents,
      patterns
    );

    const file = new File(
      Paths.cache,
      `witness-documentation-${Date.now()}.txt`
    );

    await file.write(report);
    await Sharing.shareAsync(file.uri);
  };

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 px-6 pt-6">
        <Text className="text-lg font-medium mb-2">
          Prepare documentation
        </Text>

        <Text className="text-sm text-gray-600 mb-6">
          This will organize your recorded incidents into a
          single document you can share with a lawyer, NGO,
          or trusted support person.
        </Text>

        <View className="border border-gray-200 rounded-xl p-4 mb-6">
          <Text className="text-sm mb-1">
            Total incidents recorded:{" "}
            <Text className="font-medium">
              {incidents.length}
            </Text>
          </Text>

          <Text className="text-sm mb-1">
            Overall risk level:{" "}
            <Text className="font-medium uppercase">
              {patterns.riskLevel}
            </Text>
          </Text>

          {patterns.frequencyIncreasing && (
            <Text className="text-xs text-red-600 mt-1">
              Incidents show increasing frequency
            </Text>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-xs text-gray-500">
            This document is informational and does not
            replace legal advice. It is intended to help you
            clearly present your experiences if you choose
            to seek support.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={exportDocs}
          disabled={!incidents.length}
          className={`py-4 rounded-xl ${
            incidents.length
              ? "bg-black"
              : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-center font-medium">
            Export documentation
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
