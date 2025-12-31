import "@/global.css";
import { useIncidentStore } from "@/store/useIncidentStore";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  const hydrate = useIncidentStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="unlock" />
        <Stack.Screen name="witness" />
        <Stack.Screen name="session/start" />
        <Stack.Screen name="session/listen" />
        <Stack.Screen name="session/end" />
        <Stack.Screen name="witness/prepare" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
