import { extractIncidentFromTranscript } from "@/services/extractIncident";
import { transcribeAudio } from "@/services/transcribe";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";

import { detectCrisis } from "@/lib/crisisEngine";
import { validateEvidence } from "@/lib/evidenceEngine";
import { generateFollowUps } from "@/lib/followUpEngine";
import { getGeminiInsights } from "@/lib/geminiReasoning";
import { logEvent } from "@/lib/observability";
import { computeRisk } from "@/lib/riskEngine";
import { generateSafetyPlan } from "@/lib/safetyPlanEngine";

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
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (processing) return;
      if (!incident.needsReprocessing && incident.summary)
        return;

      const startTs = Date.now();

      logEvent({
        event: "pipeline.start",
        incidentId: incident.id,
        payload: {
          reprocessing: !!incident.needsReprocessing,
        },
      });

      setProcessing(true);

      const getLatest = () =>
        useIncidentStore
          .getState()
          .incidents.find((i) => i.id === incident.id) ??
        incident;

      let latest = getLatest();

      if (!latest.audioTranscript) {
        logEvent({
          event: "pipeline.transcription.start",
          incidentId: incident.id,
        });

        const audioTranscript = await transcribeAudio(
          latest.audioUri,
          incident.id
        );

        updateIncident(latest.id, { audioTranscript });

        logEvent({
          event: "pipeline.transcription.done",
          incidentId: incident.id,
        });
      }

      latest = getLatest();

      const combinedNarrative = [
        latest.audioTranscript,
        ...(latest.userAdditions ?? []),
      ].join("\n");

      updateIncident(latest.id, { combinedNarrative });

      logEvent({
        event: "pipeline.extraction.start",
        incidentId: incident.id,
      });

      const enrichment =
        await extractIncidentFromTranscript(
          combinedNarrative,
          incident.id
        );

      if (!enrichment) {
        logEvent({
          event: "pipeline.extraction.failed",
          incidentId: incident.id,
        });
        setProcessing(false);
        return;
      }

      updateIncident(latest.id, enrichment);

      logEvent({
        event: "pipeline.extraction.done",
        incidentId: incident.id,
      });

      latest = getLatest();

      const questions = generateFollowUps(latest);
      if (questions.length) {
        updateIncident(latest.id, {
          followUpSession: {
            active: true,
            questions,
            answers: [],
            startedAt: Date.now(),
          },
        });
      }

      const crisis = detectCrisis(latest);
      if (crisis.detected) {
        updateIncident(latest.id, {
          crisis: {
            detected: true,
            reason: crisis.reason!,
            detectedAt: Date.now(),
          },
        });
      }

      const patterns = computeRisk(latest);
      updateIncident(latest.id, { patterns });

      const safetyPlan = generateSafetyPlan({
        ...latest,
        patterns,
      });
      updateIncident(latest.id, { safetyPlan });

      const legal = validateEvidence(
        useIncidentStore.getState().incidents
      );
      updateIncident(latest.id, { legal });

      latest = getLatest();

      logEvent({
        event: "pipeline.gemini_insights.start",
        incidentId: incident.id,
      });

      const aiInsights = await getGeminiInsights(
        latest
      );

      if (aiInsights) {
        updateIncident(latest.id, {
          aiInsights,
        });
      }

      logEvent({
        event: "pipeline.complete",
        incidentId: incident.id,
        payload: {
          latencyMs: Date.now() - startTs,
          risk: patterns.riskLevel,
          crisis: crisis.detected,
          completeness: legal.completenessScore,
          hasGeminiInsights: !!aiInsights,
        },
      });

      updateIncident(latest.id, {
        needsReprocessing: false,
      });

      setProcessing(false);
    };

    run();
  }, [incident.needsReprocessing, incident.summary]);

  return (
    <ScrollView contentContainerStyle={{ gap: 14 }}>
      {processing && (
        <View className="items-center py-6">
          <ActivityIndicator />
          <Text className="text-xs text-gray-500 mt-2">
            Updating analysis…
          </Text>
        </View>
      )}
      {children}
    </ScrollView>
  );
}
