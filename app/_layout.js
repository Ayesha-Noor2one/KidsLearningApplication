import { Stack } from "expo-router";
import { UsageTimerProvider } from "./UsageTimerContext";

export default function RootLayout() {
  return (
    <UsageTimerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UsageTimerProvider>
  );
}
