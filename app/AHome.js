import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from 'react';
import { initDatabase } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from "expo-router";

export default function Home() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  // Initialize the database and fetch items when the component mounts
  useEffect(() => {
    const initialize = async () => {
      await initDatabase(); 
      const userEmail = await AsyncStorage.getItem('userEmail');
      if(userEmail && userEmail.role == 'kid'){
        router.push("/StartScreen");
        return;
      }
      if(userEmail && userEmail.role == 'PARENT'){
        router.push("/Settings");
        return;
      }
    };

    initialize(); // Call the async function inside useEffect
  }, []);

  return (
    <View style={styles.container}>
      {/* Card Layout */}
      <View style={styles.card}>
        {/* Lion Image */}
        <Image source={require("../assets/images/4100_4_06.png")} style={styles.image} />

        {/* Text Section */}
        <Text style={styles.text}>Learn anything, anytime, anywhere you want.</Text>

        {/* Button Section */}
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
    backgroundColor: "#f2f2f2", // Slight background color for contrast
    padding: 0, // Zero padding around the container for better fit
  },
  card: {
    backgroundColor: "#FFD700", // Gold background for the card
    borderRadius: 12,
    padding: 50, // Increased padding inside the card for more length
    width: '90%', // Minimal spacing from edges of the screen
    maxWidth: 380, // Increased max width for a larger card
    height: 600, // Increased height for a significantly longer card
    shadowColor: "#8B0000", // Dark red shadow color
    shadowOffset: { width: 0, height: 10 }, // Increased shadow offset
    shadowOpacity: 0.2, // Reduced shadow opacity
    shadowRadius: 12, // Increased shadow blur
    elevation: 10, // Increased elevation for Android devices
    borderColor: "#8B0000", // Dark red border
    borderWidth: 3, // Dark red border width
    marginVertical: 10, // Minimal vertical margin
  },
  image: {
    width: 220, // Increased image size
    height: 220, // Increased image size
    resizeMode: "contain",
    marginBottom: 20, // Increased margin between image and text
  },
  text: {
    fontWeight: "bold",
    fontSize: 24, // Increased font size
    color: "#8B0000",
    textAlign: "center",
    marginBottom: 25, // Increased margin between text and button
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 15, // Increased padding for the button
    paddingHorizontal: 35, // Increased horizontal padding for the button
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFD700",
    fontSize: 24, // Larger button text size
    fontWeight: "bold",
  },
});
