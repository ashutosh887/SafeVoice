import { useIncidentStore } from "@/store/useIncidentStore";
import { FileText, X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import { CrisisInterventionCard } from "./CrisisInterventionCard";
import { EvidenceCompletenessCard } from "./EvidenceCompletenessCard";
import { IncidentAudioPlayer } from "./IncidentAudioPlayer";
import { IncidentDetails } from "./IncidentDetails";
import { IncidentFollowUpSession } from "./IncidentFollowUpSession";
import { IncidentProcessingGate } from "./IncidentProcessingGate";
import { RiskAssessmentCard } from "./RiskAssessmentCard";
import { SafetyPlanCard } from "./SafetyPlanCard";

export function IncidentModal({
  incidentId,
  onClose,
}: {
  incidentId: string | null;
  onClose: () => void;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );

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
            <View className="flex-row items-center gap-2">
              <FileText size={18} />
              <Text className="text-lg font-medium">
                Recorded Incident
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <IncidentAudioPlayer audioUri={incident.audioUri} />

          <IncidentProcessingGate incident={incident}>
            <View className="gap-4 mt-4">
              <CrisisInterventionCard
                incidentId={incident.id}
              />

              <IncidentFollowUpSession
                incidentId={incident.id}
              />

              <RiskAssessmentCard
                incidentId={incident.id}
              />

              <SafetyPlanCard
                incidentId={incident.id}
              />

              <EvidenceCompletenessCard />

              <IncidentDetails incident={incident} />
            </View>
          </IncidentProcessingGate>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
