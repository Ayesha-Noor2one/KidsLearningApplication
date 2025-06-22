import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';


export default function Index() {

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Redirect href="/AHome" />;
}


