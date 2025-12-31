import { IncidentRecord, RiskLevel } from "@/types/incident";

export function computeRisk(
  incident: IncidentRecord
): {
  riskLevel: RiskLevel;
  reasons: string[];
  frequencyIncreasing: boolean;
} {
  let score = 0;
  const reasons: string[] = [];

  if (incident.flags?.escalation === true) {
    score += 2;
    reasons.push("Escalation detected");
  }

  if (incident.flags?.imminentRisk === true) {
    score += 3;
    reasons.push("Imminent danger indicated");
  }

  const physicalHarm =
    incident.followUpSession?.answers.some(
      (a) =>
        a.questionId === "physical_harm" &&
        a.answer === "Yes"
    ) ?? false;

  if (physicalHarm) {
    score += 2;
    reasons.push("Physical harm confirmed");
  }

  const prior =
    incident.extracted?.priorIncidents === true;

  if (prior) {
    score += 1;
    reasons.push("Prior incidents reported");
  }

  let riskLevel: RiskLevel = "low";
  if (score >= 4) riskLevel = "high";
  else if (score >= 2) riskLevel = "medium";

  return {
    riskLevel,
    reasons,
    frequencyIncreasing: prior && physicalHarm,
  };
}
