import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View style={styles.container}>
      {/* Congrats Text */}
      <Text style={styles.congratsText}>Congrats!</Text>

      {/* Image */}
      <Image
        source={require("../assets/images/congrats.png")} // Replace with your actual image path
        style={styles.image}
      />

      {/* Description */}
      <Text style={styles.description}>
        You have successfully logged in to the app. You will get notified about daily progress.
      </Text>

      {/* Let's Go Button */}
      <Link href="/StartScreen" asChild>
        <Pressable style={styles.letsGoButton}>
          <Text style={styles.letsGoButtonText}>LET'S GO</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD700", // Yellow background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  congratsText: {
    fontSize: 40,
    fontFamily: "Consolas",
    fontWeight: "bold",
    color: "#8B0000", // Dark red
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  description: {
    fontSize: 24,
    fontFamily: "Consolas",
    color: "#8B0000", // Brown color
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },
  letsGoButton: {
    backgroundColor: "#8B0000", // Dark red
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  letsGoButtonText: {
    color: "#FFD700", // Yellow text
    fontSize: 20,
    fontFamily: "Consolas",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
