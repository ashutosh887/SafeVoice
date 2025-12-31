import { extractIncidentFromTranscript } from "@/services/extractIncident";
import { transcribeAudio } from "@/services/transcribe";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import { useEffect, useRef, useState } from "react";
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
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );

  const ranRef = useRef(false);
  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      const latest =
        useIncidentStore
          .getState()
          .incidents.find(
            (i) => i.id === incident.id
          ) ?? incident;

      let transcript = latest.transcript;

      if (!transcript) {
        setProcessing(true);
        transcript = await transcribeAudio(
          latest.audioUri
        );

        updateIncident(latest.id, {
          transcript,
        });
      }

      if (!latest.summary && transcript) {
        const enrichment =
          await extractIncidentFromTranscript(
            transcript
          );

        if (enrichment) {
          updateIncident(latest.id, enrichment);
        }
      }

      setProcessing(false);
    };

    run();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ gap: 14 }}>
      {processing && (
        <View className="items-center py-6">
          <ActivityIndicator />
          <Text className="text-xs text-gray-500 mt-2">
            Processing recording…
          </Text>
        </View>
      )}
      {children}
    </ScrollView>
  );
}
