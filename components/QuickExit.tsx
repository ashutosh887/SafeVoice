import { useRouter, type Href } from "expo-router";
import { Siren } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type QuickExitProps = {
  to?: Href;
};

export default function QuickExit({ to = "/meditation" }: QuickExitProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.replace(to)}
      style={{
        position: "absolute",
        top: insets.top + 8,
        right: 16,
        zIndex: 50,
        borderRadius: 999,
        backgroundColor: "#fee2e2",
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Siren size={16} color="#b91c1c" />
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#b91c1c",
          }}
        >
          Exit
        </Text>
      </View>
    </Pressable>
  );
}
