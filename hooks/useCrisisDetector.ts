import { CRISIS_KEYWORDS } from "@/constants/crisisKeywords";
import { useMemo } from "react";

export function useCrisisDetector(text: string | null) {
  return useMemo(() => {
    if (!text) return false;

    const normalized = text.toLowerCase();

    return CRISIS_KEYWORDS.some((phrase) =>
      normalized.includes(phrase)
    );
  }, [text]);
}
