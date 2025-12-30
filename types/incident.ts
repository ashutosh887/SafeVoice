export type IncidentRecord = {
  id: string;
  createdAt: number;

  narrative: string;
  audioUri: string;

  transcript?: string;
  summary?: string;

  extracted: {
    time?: string;
    location?: string;
    actions?: string[];
    witnesses?: string[];
    childrenPresent?: boolean;
    priorIncidents?: boolean;
  };

  flags: {
    escalation?: boolean;
    imminentRisk?: boolean;
  };
};

export type RiskLevel = "low" | "medium" | "high";

export type IncidentPatterns = {
  totalIncidents: number;
  incidentsLast7Days: number;
  incidentsLast30Days: number;
  escalationCount: number;
  imminentRiskCount: number;
  childExposureCount: number;
  frequencyIncreasing: boolean;
  riskLevel: RiskLevel;
};
