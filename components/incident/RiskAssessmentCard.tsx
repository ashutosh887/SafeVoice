import { useIncidentStore } from "@/store/useIncidentStore";
import {
    AlertTriangle,
    Plus,
    Shield,
    ShieldCheck,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AddIncidentDetailModal } from "./AddIncidentDetailModal";

export function RiskAssessmentCard({
  incidentId,
}: {
  incidentId: string;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );
  const [open, setOpen] = useState(false);

  if (!incident?.patterns) return null;

  const { riskLevel, reasons } = incident.patterns;

  const Icon =
    riskLevel === "high"
      ? AlertTriangle
      : riskLevel === "medium"
      ? Shield
      : ShieldCheck;

  return (
    <>
      <View className="border rounded-xl px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Icon size={14} />
            <Text className="text-sm font-medium">
              Risk: {riskLevel.toUpperCase()}
            </Text>
          </View>

          <Pressable
            className="flex-row items-center gap-1"
            onPress={() => setOpen(true)}
          >
            <Plus size={12} />
            <Text className="text-xs">Add detail</Text>
          </Pressable>
        </View>

        {reasons.slice(0, 2).map((r, i) => (
          <Text
            key={i}
            className="text-xs text-gray-600"
          >
            • {r}
          </Text>
        ))}
      </View>

      {open && (
        <AddIncidentDetailModal
          incidentId={incidentId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
