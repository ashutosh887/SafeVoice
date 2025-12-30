import { IncidentRecord } from "@/types/incident"
import { create } from "zustand"

type IncidentState = {
  incidents: IncidentRecord[]
  addIncident: (incident: IncidentRecord) => void
  clearIncidents: () => void
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],

  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
    })),

  clearIncidents: () => set({ incidents: [] }),
}))
