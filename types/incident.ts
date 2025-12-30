export type IncidentRecord = {
  id: string;
  createdAt: number;
  narrative: string;
  audioUri: string;
  transcript?: string;
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
