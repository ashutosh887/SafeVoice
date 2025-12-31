import { deriveIncidentInsights } from "@/lib/incidentInsights";
import { useIncidentStore } from "@/store/useIncidentStore";
import { useMemo } from "react";
import { Text, View } from "react-native";

export default function IncidentPatternInsight({
  incidentId,
}: {
  incidentId: string;
}) {
  const incidents = useIncidentStore(
    (s) => s.incidents
  );

  const insights = useMemo(() => {
    const incident = incidents.find(
      (i) => i.id === incidentId
    );
    if (!incident) return null;
    return deriveIncidentInsights(
      incident,
      incidents
    );
  }, [incidentId, incidents]);

  if (!insights) return null;

  const lines: string[] = [];

  if (insights.similarCount >= 3) {
    lines.push(
      `This incident is one of ${insights.similarCount} similar events recently.`
    );
  }

  if (insights.timeGapTrend === "shorter") {
    lines.push(
      "The time between similar incidents appears to be shortening."
    );
  }

  if (insights.riskDelta === "upward") {
    lines.push(
      "This incident shows increased risk compared to earlier entries."
    );
  }

  if (lines.length === 0) return null;

  return (
    <View className="mx-4 mt-3 mb-2 rounded-lg border border-zinc-200 px-3 py-2">
      {lines.slice(0, 2).map((line, idx) => (
        <Text
          key={idx}
          className="text-xs text-zinc-700"
        >
          {line}
        </Text>
      ))}
    </View>
  );
}
