import { IncidentRecord } from "@/types/incident";

export function generateFollowUps(
  incident: IncidentRecord
) {
  const questions = [];

  if (
    incident.flags?.escalation === true ||
    incident.extracted?.actions?.some((a) =>
      a.toLowerCase().includes("hit")
    )
  ) {
    questions.push({
      id: "physical_harm",
      question:
        "Did this incident involve any physical harm?",
    });
  }

  if (incident.extracted?.priorIncidents === null) {
    questions.push({
      id: "prior_incidents",
      question:
        "Has something like this happened before?",
    });
  }

  if (incident.extracted?.childrenPresent === null) {
    questions.push({
      id: "children_present",
      question:
        "Were any children present during this incident?",
    });
  }

  return questions.slice(0, 2);
}
