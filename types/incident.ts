export type RiskLevel = "low" | "medium" | "high";

export type CrisisState = {
  detected: boolean;
  keywords?: string[];
  detectedAt?: number;
  resolvedAt?: number;
  resolutionNote?: string;
};

export type FollowUp = {
  question: string;
  answer: string;
  askedAt: number;
};

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

  followUps?: FollowUp[];
  crisis?: CrisisState;

  intervention?: {
    started: boolean;
  };

  legal?: {
    completenessScore: number;
    missingCriticalInfo: string[];
  };

  patterns?: {
    frequencyIncreasing: boolean;
    riskLevel: RiskLevel;
    reasons: string[];
  };
};
