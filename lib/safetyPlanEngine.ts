import { IncidentRecord } from "@/types/incident";

export type SafetyAction = {
  id: string;
  label: string;
};

export function generateSafetyPlan(
  incident: IncidentRecord
): SafetyAction[] {
  const actions: SafetyAction[] = [];

  if (incident.patterns?.riskLevel === "high") {
    actions.push(
      { id: "emergency", label: "Contact emergency services" },
      { id: "trusted", label: "Reach out to a trusted person" }
    );
  }

  if (
    incident.patterns?.riskLevel === "medium" ||
    incident.flags?.escalation === true
  ) {
    actions.push(
      { id: "safety_plan", label: "Create a personal safety plan" },
      { id: "resources", label: "View local support resources" }
    );
  }

  actions.push(
    { id: "evidence", label: "Continue documenting incidents" }
  );

  return actions;
}
