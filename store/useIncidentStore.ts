import { IncidentRecord } from "@/types/incident";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "SAFEVOICE_INCIDENTS";

type IncidentState = {
  incidents: IncidentRecord[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  createIncident: (incident: IncidentRecord) => void;
  updateIncident: (
    id: string,
    patch: Partial<IncidentRecord>
  ) => void;
  removeIncident: (id: string) => void;
};

export const useIncidentStore = create<IncidentState>(
  (set, get) => ({
    incidents: [],
    hydrated: false,

    hydrate: async () => {
      const raw = await AsyncStorage.getItem(
        STORAGE_KEY
      );
      const incidents: IncidentRecord[] =
        raw ? JSON.parse(raw) : [];

      set({ incidents, hydrated: true });
    },

    createIncident: (incident) => {
      const incidents = [
        incident,
        ...get().incidents,
      ];

      set({ incidents });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },

    updateIncident: (id, patch) => {
      const incidents = get().incidents.map(
        (i) =>
          i.id === id
            ? {
                ...i,
                ...patch,
              }
            : i
      );

      set({ incidents });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },

    removeIncident: (id) => {
      const incidents = get().incidents.filter(
        (i) => i.id !== id
      );

      set({ incidents });
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
      );
    },
  })
);
