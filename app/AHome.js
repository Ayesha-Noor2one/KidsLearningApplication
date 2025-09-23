import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from 'react';
import { initDatabase,truncateTest } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from "expo-router";
import { UsageTimerProvider } from "./UsageTimerContext";

export default function Home() {
  const [items, setItems] = useState([]);
  const router = useRouter();

 useEffect(() => {
  const initialize = async () => {
    await initDatabase();
    await truncateTest();

    const storedUser = await AsyncStorage.getItem('userEmail');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.role === 'kid') {
        router.push("/StartScreen");
        return;
      }
      if (user.role === 'PARENT') {
        router.push("/Settings");
        return;
      }
    }
  };

  initialize();
}, []);


  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Image source={require("../assets/images/4100_4_06.png")} style={styles.image} />
        <Text style={styles.text}>Learn anything, anytime, anywhere you want.</Text>
        <Link href="/Login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start Now!</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2", 
    padding: 0,
  },
  card: {
    backgroundColor: "#FFD700", 
    borderRadius: 12,
    padding: 50, 
    width: '90%', 
    maxWidth: 380, 
    height: 600, 
    shadowColor: "#8B0000", 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 12, 
    elevation: 10, 
    borderColor: "#8B0000", 
    borderWidth: 3, 
    marginVertical: 10, 
  },
  image: {
    width: 220, 
    height: 220,
    resizeMode: "contain",
    marginBottom: 20, 
  },
  text: {
    fontWeight: "bold",
    fontSize: 24, 
    color: "#8B0000",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 15,
    paddingHorizontal: 35, 
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFD700",
    fontSize: 24, 
    fontWeight: "bold",
  },
});
