import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

export default function CrisisOverlay({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) {
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 360,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#fee2e2",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={22} color="#dc2626" />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            I might be mistaken
          </Text>

          <Text
            style={{
              textAlign: "center",
              color: "#52525b",
              marginBottom: 24,
            }}
          >
            Something you said sounded urgent.  
            Are you in immediate danger right now?
          </Text>

          <Pressable
            onPress={async () => {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            }}
            style={{
              width: "100%",
              backgroundColor: "#dc2626",
              paddingVertical: 14,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Call emergency services
            </Text>
          </Pressable>

          <Pressable
            onPress={onContinue}
            style={{
              width: "100%",
              backgroundColor: "#e5e7eb",
              paddingVertical: 14,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Continue listening
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/meditation")}
            style={{
              width: "100%",
              backgroundColor: "#f4f4f5",
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Exit safely
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
