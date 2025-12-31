import { useIncidentStore } from "@/store/useIncidentStore";
import {
    ArrowRight,
    FilePlus,
    PhoneCall,
    Shield,
    Users,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function SafetyPlanCard({
  incidentId,
}: {
  incidentId: string;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );

  if (!incident?.safetyPlan?.length) return null;

  const iconFor = (id: string) => {
    switch (id) {
      case "emergency":
        return PhoneCall;
      case "trusted":
        return Users;
      case "safety_plan":
        return Shield;
      default:
        return FilePlus;
    }
  };

  return (
    <View className="border rounded-xl px-4 py-3">
      <Text className="text-sm font-medium mb-2">
        Suggested next steps
      </Text>

      {incident.safetyPlan.slice(0, 3).map((a) => {
        const Icon = iconFor(a.id);
        return (
          <Pressable
            key={a.id}
            className="flex-row items-center justify-between py-1"
          >
            <View className="flex-row items-center gap-2">
              <Icon size={14} />
              <Text className="text-xs">
                {a.label}
              </Text>
            </View>
            <ArrowRight size={12} />
          </Pressable>
        );
      })}
    </View>
  );
}
