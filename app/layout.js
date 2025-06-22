import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="AHome" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" options={{ headerShown: false }} />
      <Stack.Screen name="StartScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Alphabets" options={{ headerShown: false }} />
      <Stack.Screen name="flashcards" options={{ headerShown: false }} />
      <Stack.Screen name="LetterTracing" options={{ headerShown: false }} />
      <Stack.Screen name="Findtheletter" options={{ headerShown: false }} />
    </Stack>
  );
}
