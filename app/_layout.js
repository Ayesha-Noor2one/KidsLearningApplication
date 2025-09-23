import { useEffect } from "react";
import { BackHandler } from "react-native";
import { Stack } from "expo-router";
import { UsageTimerProvider } from "./UsageTimerContext";

export default function RootLayout() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true; 
      }
    );

    return () => backHandler.remove(); 
  }, []);
  return (
    <UsageTimerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UsageTimerProvider>
  );
}
