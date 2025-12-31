import { useIncidentStore } from "@/store/useIncidentStore";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export function AddIncidentDetailModal({
  incidentId,
  onClose,
}: {
  incidentId: string;
  onClose: () => void;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );
  const [text, setText] = useState("");

  if (!incident) return null;

  const save = () => {
    updateIncident(incidentId, {
      userAdditions: [
        ...(incident.userAdditions ?? []),
        text,
      ],
      summary: undefined,
      patterns: undefined,
      safetyPlan: undefined,
      legal: undefined,
      crisis: undefined,
      needsReprocessing: true,
    });
    onClose();
  };

  return (
    <Modal transparent animationType="fade">
      <Pressable
        className="flex-1 bg-black/40 justify-center px-6"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl p-5"
          onPress={() => {}}
        >
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-medium">
              Add details
            </Text>
            <Pressable onPress={onClose}>
              <X size={18} />
            </Pressable>
          </View>

          <TextInput
            multiline
            className="border rounded-xl p-3 text-sm min-h-[90px]"
            placeholder="Add any detail you remember"
            value={text}
            onChangeText={setText}
          />

          <Pressable
            className="mt-4 bg-black rounded-xl py-2 items-center"
            onPress={save}
          >
            <Text className="text-white text-sm">
              Save & re-analyze
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
