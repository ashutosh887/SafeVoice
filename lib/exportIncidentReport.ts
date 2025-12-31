import { IncidentRecord, RiskLevel } from "@/types/incident";

type DerivedPatterns = {
  totalIncidents: number;
  frequencyIncreasing: boolean;
  riskLevel: RiskLevel;
};

function derivePatterns(
  incidents: IncidentRecord[]
): DerivedPatterns {
  const totalIncidents = incidents.length;

  const sorted = [...incidents].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const frequencyIncreasing =
    sorted.length >= 3 &&
    sorted[0].createdAt - sorted[2].createdAt <
      1000 * 60 * 60 * 24;

  let riskLevel: RiskLevel = "low";

  if (
    incidents.some(
      (i) =>
        i.crisis?.detected ||
        i.flags?.imminentRisk
    )
  ) {
    riskLevel = "high";
  } else if (
    incidents.some(
      (i) =>
        i.flags?.escalation ||
        i.patterns?.riskLevel === "medium"
    )
  ) {
    riskLevel = "medium";
  }

  return {
    totalIncidents,
    frequencyIncreasing,
    riskLevel,
  };
}

export function exportIncidentReport(
  incidents: IncidentRecord[]
): string {
  const patterns = derivePatterns(incidents);

  const lines: string[] = [];

  lines.push("INCIDENT REPORT");
  lines.push("================");
  lines.push("");
  lines.push(`Total incidents: ${patterns.totalIncidents}`);
  lines.push(
    `Overall risk level: ${patterns.riskLevel.toUpperCase()}`
  );

  if (patterns.frequencyIncreasing) {
    lines.push(
      "Warning: incidents appear to be increasing in frequency"
    );
  }

  lines.push("");
  lines.push("INCIDENT DETAILS");
  lines.push("----------------");

  incidents
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((incident, index) => {
      lines.push("");
      lines.push(`Incident ${index + 1}`);
      lines.push(
        `Recorded at: ${new Date(
          incident.createdAt
        ).toLocaleString()}`
      );

      if (incident.summary) {
        lines.push(`Summary: ${incident.summary}`);
      }

      if (incident.extracted?.time) {
        lines.push(
          `Time: ${incident.extracted.time}`
        );
      }

      if (incident.extracted?.location) {
        lines.push(
          `Location: ${incident.extracted.location}`
        );
      }

      if (
        incident.extracted?.actions &&
        incident.extracted.actions.length
      ) {
        lines.push(
          `Actions: ${incident.extracted.actions.join(
            ", "
          )}`
        );
      }

      if (
        incident.extracted?.witnesses &&
        incident.extracted.witnesses.length
      ) {
        lines.push(
          `Witnesses: ${incident.extracted.witnesses.join(
            ", "
          )}`
        );
      }

      if (
        incident.extracted?.childrenPresent !==
        undefined
      ) {
        lines.push(
          `Children present: ${
            incident.extracted.childrenPresent
              ? "Yes"
              : "No"
          }`
        );
      }

      if (incident.transcript) {
        lines.push("");
        lines.push("Transcript:");
        lines.push(incident.transcript);
      }
    });

  return lines.join("\n");
}
