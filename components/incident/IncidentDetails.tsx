import { IncidentRecord } from "@/types/incident";
import { Text, View } from "react-native";

const row = (label: string, value: string) => (
  <View>
    <Text className="text-xs text-gray-500 mb-1">
      {label}
    </Text>
    <Text className="text-sm text-gray-800">
      {value}
    </Text>
  </View>
);

export function IncidentDetails({
  incident,
}: {
  incident: IncidentRecord;
}) {
  return (
    <>
      {row(
        "Summary",
        incident.summary ??
          "No concerning content detected."
      )}

      {row(
        "Time",
        incident.extracted?.time ?? "Not mentioned"
      )}

      {row(
        "Location",
        incident.extracted?.location ??
          "Not mentioned"
      )}

      {row(
        "Actions",
        incident.extracted?.actions?.length
          ? incident.extracted.actions.join(", ")
          : "No actions detected"
      )}

      {row(
        "Witnesses",
        incident.extracted?.witnesses?.length
          ? incident.extracted.witnesses.join(", ")
          : "No witnesses mentioned"
      )}

      {row(
        "Children Present",
        incident.extracted?.childrenPresent === true
          ? "Yes"
          : incident.extracted?.childrenPresent === false
          ? "No"
          : "Not mentioned"
      )}

      {row(
        "Escalation Risk",
        incident.flags?.escalation
          ? "Possible escalation detected"
          : "No escalation detected"
      )}

      {row(
        "Immediate Risk",
        incident.flags?.imminentRisk
          ? "Immediate risk indicators present"
          : "No immediate risk detected"
      )}

      {incident.transcript &&
        row("Full Transcript", incident.transcript)}
    </>
  );
}
