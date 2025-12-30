import { IncidentRecord } from "@/types/incident";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "SAFEVOICE_INCIDENTS";

type Patterns = {
  totalIncidents: number;
  frequencyIncreasing: boolean;
  riskLevel: "low" | "medium" | "high";
};

type IncidentState = {
  incidents: IncidentRecord[];
  patterns: Patterns;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addIncident: (i: IncidentRecord) => void;
  removeIncident: (id: string) => void;
  updateIncident: (i: IncidentRecord) => void;
};

function computePatterns(
  incidents: IncidentRecord[]
): Patterns {
  const totalIncidents = incidents.length;

  const escalationCount = incidents.filter(
    (i) => i.flags?.escalation
  ).length;

  const imminentCount = incidents.filter(
    (i) => i.flags?.imminentRisk
  ).length;

  const riskLevel =
    imminentCount > 0
      ? "high"
      : escalationCount > 0
      ? "medium"
      : "low";

  const frequencyIncreasing =
    totalIncidents >= 3 &&
    incidents[0].createdAt -
      incidents[2].createdAt <
      1000 * 60 * 60 * 24;

  return {
    totalIncidents,
    frequencyIncreasing,
    riskLevel,
  };
}

export const useIncidentStore = create<IncidentState>(
  (set, get) => ({
    incidents: [],
    patterns: {
      totalIncidents: 0,
      frequencyIncreasing: false,
      riskLevel: "low",
    },
    hydrated: false,

    hydrate: async () => {
      const raw = await AsyncStorage.getItem(
        STORAGE_KEY
      );
      const incidents = raw ? JSON.parse(raw) : [];
      set({
        incidents,
        patterns: computePatterns(incidents),
        hydrated: true,
      });
    },

    addIncident: (incident) => {
      const incidents = [
        incident,
        ...get().incidents,
      ];
      set({
        incidents,
        patterns: computePatterns(incidents),
      });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },

    removeIncident: (id) => {
      const incidents = get().incidents.filter(
        (i) => i.id !== id
      );
      set({
        incidents,
        patterns: computePatterns(incidents),
      });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },

    updateIncident: (incident) => {
      const incidents = get().incidents.map(
        (i) =>
          i.id === incident.id ? incident : i
      );
      set({
        incidents,
        patterns: computePatterns(incidents),
      });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },
  })
);
