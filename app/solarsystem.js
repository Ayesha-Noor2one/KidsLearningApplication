import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasDone } from "./database";

const SOLAR_PLAY = "GuessSolarSystem";
const SOLAR_LEARN = "LearnSolarSystem";

export default function SolarSystemScreen() {
  const router = useRouter();
  const [solarPlayDone, setSolarPlayDone] = useState(0);
  const [solarLearnDone, setSolarLearnDone] = useState(0);

  const checkIfDone = async () => {
    try {
      const kidId = await AsyncStorage.getItem("kidId");
      const res = await hasDone(kidId, SOLAR_PLAY);
      const res2 = await hasDone(kidId, SOLAR_LEARN);
      if (res?.isDone === 1) setSolarPlayDone(1);
      if (res2?.isDone === 1) setSolarLearnDone(1);
    } catch (error) {
      console.error("Error checking if done:", error);
    }
  };

  useEffect(() => {
    checkIfDone();
  }, []);

  return (
    <ImageBackground
      source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }}
    
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
       
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/learnandfun")}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Solar System</Text>

        <View style={styles.cardContainer}>
         
          <TouchableOpacity
            style={[styles.card, styles.blueCard]}
            onPress={() => router.push("/learnsolarsystem")}
          >
            <Text style={styles.cardTitle}>
              Learn{" "}
              {solarLearnDone === 1 ? (
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color="green"
                  style={styles.tickIcon}
                />
              ) : (
                <Ionicons
                  name="hourglass"
                  size={30}
                  color="white"
                  style={styles.tickIcon}
                />
              )}
            </Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            style={[styles.card, styles.pinkCard]}
            onPress={() => router.push("/GuessSolarSystem")}
          >
            <Text style={styles.cardTitle}>
              Play{" "}
              {solarPlayDone === 1 ? (
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color="green"
                  style={styles.tickIcon}
                />
              ) : (
                <Ionicons
                  name="hourglass"
                  size={30}
                  color="white"
                  style={styles.tickIcon}
                />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000088",
    padding: 8,
    borderRadius: 25,
    zIndex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 35,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  cardContainer: {
    width: "80%",
  },
  card: {
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  blueCard: { backgroundColor: "#3B82F6" },
  pinkCard: { backgroundColor: "#F472B6" },
  cardTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  tickIcon: {
    marginLeft: 10,
  },
});
