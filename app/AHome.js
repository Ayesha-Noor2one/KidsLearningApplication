import { View, Text, Image, StyleSheet, Pressable, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { initDatabase, truncateTest } from "./database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Home() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initialize = async () => {
      await initDatabase();
      await truncateTest();

      const storedUser = await AsyncStorage.getItem("userEmail");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.role === "kid") {
          router.push("/StartScreen");
          return;
        }

        if (user.role === "PARENT") {
          router.push("/Settings");
          return;
        }
      }
    };

    initialize();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: floatAnim }] }
        ]}
      >
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/4100_4_06.png",
          }}
          style={styles.image}
        />

        <Text style={styles.title}>Welcome 🎈</Text>

        <Text style={styles.text}>
          Learn anything , anytime , anywhere you want.
        </Text>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            style={styles.button}
            onPress={() => router.push("/Login")}
          >
            <Text style={styles.buttonText}>Lets Go🚀</Text>
          </Pressable>
        </Animated.View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9ecf3ff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFD93D",
    top: -50,
    left: -60,
    opacity: 0.35,
  },

  circle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6C5CE7",
    bottom: 80,
    right: -50,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FF7675",
    top: 200,
    right: -20,
    opacity: 0.25,
  },

  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#9183faff",
    elevation: 14,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  image: {
    width: 230,
    height: 230,
    resizeMode: "contain",
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 15,
  },

  text: {
    fontSize: 19,
    color: "#555",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 35,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#eefa63ff",
    paddingVertical: 18,
    paddingHorizontal: 42,
    borderRadius: 50,
    elevation: 8,
  },

  buttonText: {
    color: "#FF7675",
    fontSize: 22,
    fontWeight: "bold",
  },
});