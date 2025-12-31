import QuickExit from "@/components/QuickExit";
import {
  getPin,
  setLastUnlock,
  setPin,
  verifyPin,
} from "@/lib/security";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

export default function Unlock() {
  const router = useRouter();
  const [pin, setPinInput] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPin().then(setStoredPin);
  }, []);

  const addDigit = (d: string) => {
    if (pin.length >= 4) return;
    setPinInput(pin + d);
    setError("");
  };

  const removeDigit = () => {
    setPinInput(pin.slice(0, -1));
    setError("");
  };

  const onContinue = async () => {
    if (pin.length !== 4) {
      setError("Enter a 4-digit PIN");
      return;
    }

    if (!storedPin) {
      await setPin(pin);
      await setLastUnlock();
      router.replace("/witness/home");
      return;
    }

    const ok = await verifyPin(pin);
    if (!ok) {
      setError("Incorrect PIN");
      setPinInput("");
      return;
    }

    await setLastUnlock();
    router.replace("/witness/home");
  };

  return (
    <View className="flex-1 bg-white">
      <QuickExit to="/" />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-semibold mb-4 text-center">
          {storedPin ? "Enter PIN" : "Set a PIN"}
        </Text>

        <Text className="text-base text-gray-600 text-center mb-12 max-w-[320px] leading-[22px]">
          {storedPin
            ? "Enter your PIN to continue."
            : "Create a 4-digit PIN to protect your private space."}
        </Text>

        <View className="flex-row mb-10">
          {[0,1,2,3].map((i) => (
            <View
              key={i}
              className={`mx-3 h-4 w-4 rounded-full ${
                pin.length > i ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </View>

        {error ? (
          <Text className="text-base text-red-600 mb-6">
            {error}
          </Text>
        ) : null}

        <View className="w-full max-w-[320px]">
          <View className="flex-row flex-wrap">
            {KEYS.map((k, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  if (!k) return;
                  if (k === "⌫") removeDigit();
                  else addDigit(k);
                }}
                className="w-1/3 h-20 items-center justify-center"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                {k ? (
                  <View className="h-16 w-16 rounded-full border border-gray-300 items-center justify-center">
                    <Text className="text-2xl font-medium">
                      {k}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={onContinue}
          className="mt-12 bg-black px-12 py-5 rounded-2xl"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-white text-lg font-semibold">
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
