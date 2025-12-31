import { IncidentRecord } from "@/types/incident";

type Patterns = {
  totalIncidents: number;
  frequencyIncreasing: boolean;
  riskLevel: "low" | "medium" | "high";
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleString();
}

export function exportIncidentReport(
  incidents: IncidentRecord[],
  patterns: Patterns
): string {
  if (!incidents.length) return "No incidents recorded.";

  const sorted = [...incidents].sort(
    (a, b) => a.createdAt - b.createdAt
  );

  let out = "";

  out += `CONFIDENTIAL INCIDENT RECORD\n`;
  out += `Generated on: ${new Date().toLocaleString()}\n`;
  out += `Risk Level at Export: ${patterns.riskLevel.toUpperCase()}\n\n`;
  out += `----------------------------\n\n`;
  out += `CASE SUMMARY\n`;
  out += `• Total incidents recorded: ${sorted.length}\n`;
  out += `• Frequency trend: ${
    patterns.frequencyIncreasing ? "INCREASING" : "STABLE"
  }\n\n`;
  out += `----------------------------\n\n`;
  out += `INCIDENT LOG (CHRONOLOGICAL)\n\n`;

  sorted.forEach((i, idx) => {
    out += `Incident #${idx + 1}\n`;
    out += `Date: ${formatDate(i.createdAt)}\n`;
    out += `Location: ${i.extracted?.location ?? "Not specified"}\n\n`;
    out += `Summary:\n${i.summary ?? i.narrative}\n\n`;
    out += `Children present: ${
      i.extracted?.childrenPresent ? "Yes" : "No"
    }\n`;
    out += `Escalation flagged: ${
      i.flags?.escalation ? "Yes" : "No"
    }\n`;
    out += `Imminent risk flagged: ${
      i.flags?.imminentRisk ? "Yes" : "No"
    }\n\n---\n\n`;
  });

  return out;
}
