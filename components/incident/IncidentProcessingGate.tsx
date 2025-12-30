import { extractIncidentFromTranscript } from "@/services/extractIncident";
import { transcribeAudio } from "@/services/transcribe";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";

export function IncidentProcessingGate({
  incident,
  children,
}: {
  incident: IncidentRecord;
  children: React.ReactNode;
}) {
  const updateIncident = useIncidentStore((s) => s.updateIncident);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (incident.transcript || processing) return;

    const run = async () => {
      try {
        setProcessing(true);

        const transcript = await transcribeAudio(
          incident.audioUri
        );

        const base: IncidentRecord = {
          ...incident,
          transcript,
        };

        updateIncident(base);

        const enrichment =
          await extractIncidentFromTranscript(transcript);

        if (enrichment) {
          updateIncident({ ...base, ...enrichment });
        }
      } finally {
        setProcessing(false);
      }
    };

    run();
  }, [incident.id]);

  return (
    <ScrollView
      className="border border-gray-200 rounded-xl p-4"
      contentContainerStyle={{ gap: 14 }}
    >
      {processing ? (
        <View className="items-center py-8">
          <ActivityIndicator />
          <Text className="text-xs text-gray-500 mt-2">
            Processing recording…
          </Text>
        </View>
      ) : (
        children
      )}
    </ScrollView>
  );
}
