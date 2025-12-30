import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

type WaveSize = "sm" | "lg";
type WaveState = "idle" | "listening" | "stopped";

export default function VoiceWave({
  size = "sm",
  state = "idle",
  level = 0,
  onPress,
}: {
  size?: WaveSize;
  state?: WaveState;
  level?: number;
  onPress?: () => void;
}) {
  const BAR_COUNT = size === "lg" ? 21 : 11;
  const BAR_HEIGHT = size === "lg" ? 96 : 48;
  const BAR_WIDTH = size === "lg" ? 4 : 3;
  const GAP = size === "lg" ? 4 : 3;

  const clock = useRef(new Animated.Value(0)).current;

  const bars = useRef(
    Array.from({ length: BAR_COUNT }).map((_, i) => ({
      phase: i * 0.6 + Math.random() * 0.5,
      scale: new Animated.Value(0.15),
    }))
  ).current;

  useEffect(() => {
    if (state === "listening") {
      Animated.loop(
        Animated.timing(clock, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        })
      ).start();
    } else {
      clock.stopAnimation();
      bars.forEach((b) =>
        Animated.timing(b.scale, {
          toValue: state === "stopped" ? 0.35 : 0.15,
          duration: 200,
          useNativeDriver: true,
        }).start()
      );
    }
  }, [state]);

  useEffect(() => {
    if (state !== "listening") return;

    bars.forEach((bar, i) => {
      const intensity =
        0.15 +
        Math.min(level * 1.4, 1) *
          (0.6 + Math.sin(bar.phase) * 0.4);

      Animated.timing(bar.scale, {
        toValue: intensity,
        duration: 80,
        useNativeDriver: true,
      }).start();
    });
  }, [level, state]);

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: BAR_HEIGHT + 20,
        }}
      >
        {bars.map((bar, i) => {
          const shade =
            state === "listening"
              ? 30 + Math.abs(i - BAR_COUNT / 2) * 6
              : 160;

          return (
            <Animated.View
              key={i}
              style={{
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                marginHorizontal: GAP / 2,
                borderRadius: BAR_WIDTH,
                backgroundColor: `rgb(${shade},${shade},${shade})`,
                transform: [{ scaleY: bar.scale }],
              }}
            />
          );
        })}
      </View>
    </Pressable>
  );
}
