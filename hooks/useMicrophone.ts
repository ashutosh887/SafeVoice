import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import { useEffect, useState } from "react";

export function useMicrophone() {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const current = await getRecordingPermissionsAsync();
      if (current.status === "granted") {
        if (mounted) setGranted(true);
        return;
      }

      const requested = await requestRecordingPermissionsAsync();
      if (mounted) setGranted(requested.granted);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return granted;
}
