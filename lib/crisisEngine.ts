import { IncidentRecord } from "@/types/incident";

const CRISIS_KEYWORDS = [
  "kill",
  "die",
  "suicide",
  "hurt me",
  "threatened to kill",
  "weapon",
  "knife",
  "gun",
  "choking",
  "bleeding",
];

export function detectCrisis(
  incident: IncidentRecord
): { detected: boolean; reason?: string } {
  if (incident.flags?.imminentRisk) {
    return {
      detected: true,
      reason: "Imminent danger detected in narration",
    };
  }

  const text =
    incident.combinedNarrative?.toLowerCase() ??
    "";

  for (const keyword of CRISIS_KEYWORDS) {
    if (text.includes(keyword)) {
      return {
        detected: true,
        reason: `Detected urgent keyword: "${keyword}"`,
      };
    }
  }

  const physicalHarmConfirmed =
    incident.followUpSession?.answers.some(
      (a) =>
        a.questionId === "physical_harm" &&
        a.answer === "Yes"
    );

  if (physicalHarmConfirmed) {
    return {
      detected: true,
      reason: "Physical harm confirmed",
    };
  }

  return { detected: false };
}
