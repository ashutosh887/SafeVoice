import { View } from "react-native";

export default function VoiceCircle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#f4f4f5",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}
