// BalloonGame.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const LETTERS = ["A", "B", "C", "D", "E"];

export default function BalloonGame() {
  const router = useRouter();
  const [target, setTarget] = useState("A");
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    spawnBalloons();
  }, []);

  const spawnBalloons = () => {
    // ek hi dafa balloons banao
    let newBalloons = LETTERS.map((letter, index) => {
      let y = new Animated.Value(height + Math.random() * 200);
      let x = Math.random() * (width - 80);

      // har balloon ko float karna
      Animated.timing(y, {
        toValue: -150,
        duration: 8000 + Math.random() * 3000, // ⬅️ speed thodi slow
        useNativeDriver: true,
      }).start(() => {
        // jab balloon screen se upar nikal jaye to dobara neeche se aa jaye
        y.setValue(height + Math.random() * 200);
        Animated.timing(y, {
          toValue: -150,
          duration: 8000 + Math.random() * 3000,
          useNativeDriver: true,
        }).start();
      });

      return { id: index, letter, y, x };
    });

    setBalloons(newBalloons);
  };

  const handlePress = (letter) => {
    if (letter === target) {
      alert(`🎉 Correct! ${letter}`);
      // next random letter
      const next = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      setTarget(next);
    } else {
      alert("❌ Try Again!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/threeplay")}
      >
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.header}>🎈 Find Letter: {target}</Text>

      {balloons.map((balloon) => (
        <Animated.View
          key={balloon.id}
          style={[
            styles.balloon,
            {
              transform: [{ translateY: balloon.y }, { translateX: balloon.x }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => handlePress(balloon.letter)}>
            <Text style={styles.balloonText}>{balloon.letter}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
    backgroundColor: "#0006",
    padding: 10,
    borderRadius: 10,
  },
  balloon: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF69B4",
    alignItems: "center",
    justifyContent: "center",
  },
  balloonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
});
