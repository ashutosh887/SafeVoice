import { IncidentRecord } from "@/types/incident";

export function validateEvidence(
  incidents: IncidentRecord[]
): {
  completenessScore: number;
  missingCriticalInfo: string[];
} {
  let score = 0;
  const missing: string[] = [];

  const hasNarrative = incidents.some(
    (i) => !!i.combinedNarrative
  );
  if (hasNarrative) score += 25;
  else missing.push("Narrative account");

  const hasAudioTranscript = incidents.some(
    (i) => !!i.audioTranscript
  );
  if (hasAudioTranscript) score += 20;
  else missing.push("Audio transcript");

  const hasSummary = incidents.some(
    (i) => !!i.summary
  );
  if (hasSummary) score += 15;
  else missing.push("Summary");

  const hasTime = incidents.some(
    (i) => !!i.extracted?.time
  );
  if (hasTime) score += 10;
  else missing.push("Time of incident");

  const hasLocation = incidents.some(
    (i) => !!i.extracted?.location
  );
  if (hasLocation) score += 10;
  else missing.push("Location");

  const hasActions = incidents.some(
    (i) => (i.extracted?.actions?.length ?? 0) > 0
  );
  if (hasActions) score += 10;
  else missing.push("Actions described");

  const hasPattern = incidents.some(
    (i) =>
      i.patterns &&
      i.patterns.riskLevel !== "low"
  );
  if (hasPattern) score += 10;
  else missing.push("Pattern or escalation evidence");

  return {
    completenessScore: Math.min(score, 100),
    missingCriticalInfo: missing,
  };
}
