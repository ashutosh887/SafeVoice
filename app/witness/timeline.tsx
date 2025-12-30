import { IncidentModal } from "@/components/IncidentModal";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import * as Haptics from "expo-haptics";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Timeline() {
  const incidents = useIncidentStore((s) => s.incidents);
  const hydrate = useIncidentStore((s) => s.hydrate);
  const removeIncident = useIncidentStore((s) => s.removeIncident);

  const [selected, setSelected] =
    useState<IncidentRecord | null>(null);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 pt-10">
        <FlatList
          data={incidents}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{
            padding: 16,
            gap: 12,
            paddingBottom: 32,
          }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-24">
              No recordings yet
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelected(item)}
              className="bg-white rounded-2xl border border-gray-200 p-4"
            >
              <Text className="text-sm text-gray-800 mb-1">
                Voice Recording
              </Text>

              <Text className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </Text>

              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Light
                  );
                  removeIncident(item.id);
                }}
                hitSlop={12}
                className="absolute right-4 top-4"
              >
                <Trash2 size={18} color="#6b7280" />
              </Pressable>
            </Pressable>
          )}
        />
      </View>

      <IncidentModal
        incident={selected}
        onClose={() => setSelected(null)}
      />
    </SafeScreen>
  );
}
