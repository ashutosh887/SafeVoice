export type RiskLevel = "low" | "medium" | "high";

export type CrisisState = {
  detected: boolean;
  reason: string;
  detectedAt: number;
  acknowledged?: boolean;
  resolvedAt?: number;
  resolutionAction?: "called_help" | "dismissed";
};

export type FollowUpQuestion = {
  id: string;
  question: string;
  answered?: boolean;
};

export type FollowUpAnswer = {
  questionId: string;
  answer: string;
  answeredAt: number;
};

export type IncidentRecord = {
  id: string;
  createdAt: number;

  narrative: string;
  audioUri: string;

  audioTranscript?: string;
  userAdditions?: string[];
  combinedNarrative?: string;

  summary?: string;

  extracted: {
    time?: string | null;
    location?: string | null;
    actions?: string[] | null;
    witnesses?: string[] | null;
    childrenPresent?: boolean | null;
    priorIncidents?: boolean | null;
  };

  flags: {
    escalation?: boolean | null;
    imminentRisk?: boolean | null;
  };

  followUpSession?: {
    active: boolean;
    questions: FollowUpQuestion[];
    answers: FollowUpAnswer[];
    startedAt: number;
  };

  crisis?: CrisisState;

  legal?: {
    completenessScore: number;
    missingCriticalInfo: string[];
  };

  patterns?: {
    frequencyIncreasing: boolean;
    riskLevel: RiskLevel;
    reasons: string[];
  };

  safetyPlan?: {
    id: string;
    label: string;
  }[];

  aiInsights?: {
    patternSummary: string;
    riskExplanation: string;
  };

  needsReprocessing?: boolean;
};
