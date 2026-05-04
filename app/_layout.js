import { useEffect } from "react";
import { BackHandler } from "react-native";
import { Stack } from "expo-router";
import { UsageTimerProvider } from "./UsageTimerContext";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // 👈 ADD THIS

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
    // 👇 WRAP EVERYTHING INSIDE THIS
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UsageTimerProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </UsageTimerProvider>
    </GestureHandlerRootView>
  );
}