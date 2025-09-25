// CountingGame.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CountingGame() {
  const router = useRouter();

  const allFruits = ["🍎", "🍌", "🍊", "🍇", "🍉", "🍓", "🍍", "🥭", "🥝"];
  const [fruits, setFruits] = useState([]);
  const [tapped, setTapped] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // function to start a new random game
  const startNewGame = () => {
    const randomCount = Math.floor(Math.random() * 4) + 2; // 2–5 fruits
    const shuffled = [...allFruits].sort(() => 0.5 - Math.random());
    setFruits(shuffled.slice(0, randomCount));
    setTapped([]);
    setGameOver(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleTap = (index) => {
    if (!tapped.includes(index)) {
      const newTapped = [...tapped, index];
      setTapped(newTapped);

      if (newTapped.length === fruits.length) {
        setGameOver(true);
      }
    }
  };

  const handleBack = () => {
    Alert.alert("Confirm", "Do you want to go back?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => router.push("/twoplay") },
    ]);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Back button with popup */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Count the Fruits 🍎🍌</Text>
        <Text style={styles.counter}>
          Count: {tapped.length} / {fruits.length}
        </Text>

        {!gameOver ? (
          <View style={styles.grid}>
            {fruits.map((fruit, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.fruitBox,
                  tapped.includes(idx) && { opacity: 0.2 },
                ]}
                onPress={() => handleTap(idx)}
              >
                <Text style={styles.fruit}>{fruit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.endBox}>
            <Text style={styles.endText}>
              🎉 Well Done! You counted {fruits.length} fruits 🎉
            </Text>
            <TouchableOpacity
              style={styles.replayButton}
              onPress={startNewGame}
            >
              <Text style={styles.replayText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    backgroundColor: "#ffffffcc",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counter: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  fruitBox: {
    width: 100,
    height: 100,
    margin: 15,
    borderRadius: 20,
    backgroundColor: "#fff9",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fruit: {
    fontSize: 50,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
  endBox: {
    marginTop: 50,
    alignItems: "center",
  },
  endText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#ffffffcc",
    padding: 12,
    borderRadius: 12,
  },
  replayButton: {
    backgroundColor: "#32CD32",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  replayText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
});
