import { View } from "react-native";

type Size = "sm" | "md" | "lg";

export default function CircleInherit({
  children,
  size = "sm",
}: {
  children: React.ReactNode;
  size?: Size;
}) {
  const dimension =
    size === "lg" ? 180 :
    size === "md" ? 120 :
    88;

  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: "#f4f4f5",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}
