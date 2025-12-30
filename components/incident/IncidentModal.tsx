import { IncidentRecord } from "@/types/incident";
import { X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import { IncidentAudioPlayer } from "./IncidentAudioPlayer";
import { IncidentContextBanner } from "./IncidentContextBanner";
import { IncidentDetails } from "./IncidentDetails";
import { IncidentProcessingGate } from "./IncidentProcessingGate";

export function IncidentModal({
  incident,
  onClose,
}: {
  incident: IncidentRecord | null;
  onClose: () => void;
}) {
  if (!incident) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable
        className="flex-1 bg-black/40 justify-center px-6"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-3xl p-6 max-h-[85%]"
          onPress={() => {}}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-medium">
              Recorded Incident
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <IncidentAudioPlayer audioUri={incident.audioUri} />

          <IncidentProcessingGate incident={incident}>
            <IncidentContextBanner />
            <IncidentDetails incident={incident} />
          </IncidentProcessingGate>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
