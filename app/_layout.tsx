import "@/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="unlock" />
        <Stack.Screen name="witness" />
        <Stack.Screen name="session/start" />
        <Stack.Screen name="session/listen" />
        <Stack.Screen name="session/end" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
