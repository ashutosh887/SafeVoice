import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function VoiceWave() {
  const bars = Array.from({ length: 7 });
  const animValues = bars.map(() => useRef(new Animated.Value(0.3)).current);

  useEffect(() => {
    const animations = animValues.map((value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 300 + Math.random() * 300,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 4, height: 28 }}>
      {animValues.map((val, i) => (
        <Animated.View
          key={i}
          style={{
            width: 4,
            borderRadius: 2,
            backgroundColor: "#52525b",
            transform: [{ scaleY: val }],
          }}
        />
      ))}
    </View>
  );
}
