import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";

type WaveSize = "sm" | "lg";

export default function VoiceWave({
  size = "sm",
  onPress,
}: {
  size?: WaveSize;
  onPress?: () => void;
}) {
  const BAR_COUNT = size === "lg" ? 11 : 7;
  const BAR_HEIGHT = size === "lg" ? 56 : 36;
  const BAR_WIDTH = size === "lg" ? 7 : 5;
  const GAP = size === "lg" ? 6 : 4;
  const MAX_SCALE = size === "lg" ? 1.25 : 1.1;

  const animValues = Array.from({ length: BAR_COUNT }).map(
    () => useRef(new Animated.Value(0.4)).current
  );

  useEffect(() => {
    const animations = animValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: MAX_SCALE,
            duration: 280 + index * 50,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.4,
            duration: 280 + index * 40,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.stagger(70, animations).start();
  }, []);

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: BAR_HEIGHT + 8,
        }}
      >
        {animValues.map((val, i) => (
          <Animated.View
            key={i}
            style={{
              width: BAR_WIDTH,
              height: BAR_HEIGHT,
              marginHorizontal: GAP / 2,
              borderRadius: BAR_WIDTH / 2,
              backgroundColor: "#52525b",
              transform: [{ scaleY: val }],
            }}
          />
        ))}
      </View>
    </Pressable>
  );
}
