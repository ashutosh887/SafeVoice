import HapticTabButton from "@/components/HapticTab";
import { isLocked } from "@/lib/security";
import { Tabs, useRouter } from "expo-router";
import { HelpCircle, Home, List, Shield } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 22;
const AUTO_LOCK_MS = 5 * 60 * 1000;

export default function WitnessLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    isLocked(AUTO_LOCK_MS).then((locked) => {
      if (locked) router.replace("/unlock");
      else setReady(true);
    });
  }, []);

  if (!ready) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#010100",
        tabBarInactiveTintColor: "#6b7280",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          height: Platform.OS === "ios" ? 64 + insets.bottom : 64,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        tabBarButton: (props) => <HapticTabButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={ICON_SIZE} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarIcon: ({ color, focused }) => (
            <List size={ICON_SIZE} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="safety"
        options={{
          title: "Safety",
          tabBarIcon: ({ color, focused }) => (
            <Shield size={ICON_SIZE} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, focused }) => (
            <HelpCircle size={ICON_SIZE} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="prepare"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
