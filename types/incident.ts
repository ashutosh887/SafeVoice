export type IncidentRecord = {
  id: string;
  createdAt: number;

  // Raw user narrative (voice → text)
  narrative: string;

  // AI / logic extracted fields (optional, progressive)
  extracted: {
    time?: string;
    location?: string;
    actions?: string[];
    witnesses?: string[];
    childrenPresent?: boolean;
    priorIncidents?: boolean;
  };

  // Safety / escalation signals
  flags: {
    escalation?: boolean;
    imminentRisk?: boolean;
  };
};
