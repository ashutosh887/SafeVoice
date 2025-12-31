import { useIncidentStore } from "@/store/useIncidentStore";
import {
    AlertCircle,
    CheckCircle,
    Plus,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AddIncidentDetailModal } from "./AddIncidentDetailModal";

export function EvidenceCompletenessCard() {
  const incidents = useIncidentStore(
    (s) => s.incidents
  );
  const [open, setOpen] = useState(false);

  const legal =
    incidents.length > 0
      ? incidents[0].legal
      : null;

  if (!legal) return null;

  return (
    <>
      <View className="border rounded-xl px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <CheckCircle size={14} />
            <Text className="text-sm font-medium">
              Evidence readiness
            </Text>
          </View>
          <Text className="text-sm">
            {legal.completenessScore}%
          </Text>
        </View>

        {legal.missingCriticalInfo
          .slice(0, 2)
          .map((m) => (
            <View
              key={m}
              className="flex-row items-center gap-2"
            >
              <AlertCircle size={12} />
              <Text className="text-xs">{m}</Text>
            </View>
          ))}

        <Pressable
          className="flex-row items-center gap-1 mt-2"
          onPress={() => setOpen(true)}
        >
          <Plus size={12} />
          <Text className="text-xs">
            Add missing details
          </Text>
        </Pressable>
      </View>

      {open && (
        <AddIncidentDetailModal
          incidentId={incidents[0].id}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
