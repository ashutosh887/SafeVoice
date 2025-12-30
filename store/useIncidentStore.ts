import { IncidentRecord } from "@/types/incident";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "SAFEVOICE_INCIDENTS";

type IncidentState = {
  incidents: IncidentRecord[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addIncident: (i: IncidentRecord) => void;
  removeIncident: (id: string) => void;
  updateIncident: (i: IncidentRecord) => void;
};

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  hydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      set({ incidents: JSON.parse(raw) });
    }
    set({ hydrated: true });
  },

  addIncident: (incident) => {
    const updated = [incident, ...get().incidents];
    set({ incidents: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  removeIncident: (id) => {
    const updated = get().incidents.filter(
      (i) => i.id !== id
    );
    set({ incidents: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateIncident: (incident) => {
    const updated = get().incidents.map((i) =>
      i.id === incident.id ? incident : i
    );
    set({ incidents: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
