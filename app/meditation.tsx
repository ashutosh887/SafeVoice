import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import { useRouter } from "expo-router";
import { ArrowDown, ArrowUp, Heart } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

const DURATIONS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

export default function Meditation() {
  const { speak, stop } = useElevenLabsTTS();
  const router = useRouter();
  const [selected, setSelected] = useState(120);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!running) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.25,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    setPhase("in");
    speak("Breathe in slowly. Pause. Breathe out gently.");

    const phaseInterval = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, 4000);

    const voiceInterval = setInterval(() => {
      speak("Inhale. Pause. Exhale.");
    }, 15000);

    const timeout = setTimeout(() => {
      clearInterval(phaseInterval);
      clearInterval(voiceInterval);
      animation.stop();
      stop();
      setRunning(false);
    }, selected * 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(voiceInterval);
      clearTimeout(timeout);
      animation.stop();
      stop();
    };
  }, [running]);

  const isInhale = phase === "in";

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-semibold mb-12">
        Take a moment
      </Text>

      <Animated.View
        style={{ transform: [{ scale: running ? scale : 1 }] }}
        className={`w-36 h-36 rounded-full items-center justify-center border-2 ${
          !running
            ? "border-red-300 bg-red-50"
            : isInhale
            ? "border-blue-400 bg-blue-50"
            : "border-amber-400 bg-amber-50"
        }`}
      >
        {!running ? (
          <Heart size={36} color="#dc2626" />
        ) : isInhale ? (
          <ArrowUp size={36} color="#2563eb" />
        ) : (
          <ArrowDown size={36} color="#d97706" />
        )}
      </Animated.View>

      {running && (
        <Text
          className={`mt-8 text-lg font-medium ${
            isInhale ? "text-blue-600" : "text-amber-600"
          }`}
        >
          {isInhale ? "Breathe in slowly" : "Breathe out gently"}
        </Text>
      )}

      {!running && (
        <>
          <View className="flex-row gap-3 mt-14 mb-10">
            {DURATIONS.map((d) => (
              <Pressable
                key={d.value}
                onPress={() => setSelected(d.value)}
                className={`px-4 py-2 rounded-full border ${
                  selected === d.value
                    ? "bg-black border-black"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={
                    selected === d.value
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => setRunning(true)}
            className="px-6 py-4 rounded-xl bg-black w-[240px] mb-6"
          >
            <Text className="text-white font-medium text-center text-base">
              Start breathing
            </Text>
          </Pressable>
        </>
      )}

      <Pressable
        onPress={() => {
          if(running) {
            stop();
            setRunning(false);
          } else {
            router.replace("/");
          }
        }}
        className="px-6 py-4 rounded-xl border border-gray-300 w-[240px]"
      >
        <Text className="text-black font-medium text-center text-base">
          Exit
        </Text>
      </Pressable>
    </View>
  );
}
