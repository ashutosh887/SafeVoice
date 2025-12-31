import { IncidentRecord } from "@/types/incident";

export type IncidentInsights = {
  similarCount: number;
  trend: "stable" | "increasing" | "escalating";
  timeGapTrend: "shorter" | "same" | "longer";
  riskDelta: "none" | "upward";
};

const DAY_MS = 1000 * 60 * 60 * 24;

function isSimilar(a: IncidentRecord, b: IncidentRecord) {
  if (!a.flags || !b.flags) return false;

  return (
    a.flags.escalation === b.flags.escalation &&
    a.flags.imminentRisk === b.flags.imminentRisk
  );
}

export function deriveIncidentInsights(
  incident: IncidentRecord,
  all: IncidentRecord[]
): IncidentInsights {
  const others = all
    .filter((i) => i.id !== incident.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const similar = others.filter((i) =>
    isSimilar(incident, i)
  );

  const similarCount = similar.length + 1;

  let timeGapTrend: IncidentInsights["timeGapTrend"] =
    "same";

  if (similar.length >= 2) {
    const latestGap =
      incident.createdAt - similar[0].createdAt;
    const prevGap =
      similar[0].createdAt - similar[1].createdAt;

    if (latestGap < prevGap) timeGapTrend = "shorter";
    else if (latestGap > prevGap)
      timeGapTrend = "longer";
  }

  let riskDelta: IncidentInsights["riskDelta"] =
    "none";

  if (
    incident.flags?.imminentRisk &&
    !similar.some((i) => i.flags?.imminentRisk)
  ) {
    riskDelta = "upward";
  }

  let trend: IncidentInsights["trend"] = "stable";

  if (riskDelta === "upward") {
    trend = "escalating";
  } else if (
    similarCount >= 3 &&
    timeGapTrend === "shorter"
  ) {
    trend = "increasing";
  }

  return {
    similarCount,
    trend,
    timeGapTrend,
    riskDelta,
  };
}
