import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const getRandomPosition = () => {
  const size = 80;
  const x = Math.random() * (width - size);
  const y = Math.random() * (height - size - 100) + 100; 
  return { x, y, size };
};

const TapTheCircleGame = () => {
  const router = useRouter();
  const [position, setPosition] = useState(getRandomPosition());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleTap = () => {
    if (gameOver) return;
    setScore(score + 1);
    setPosition(getRandomPosition());
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setPosition(getRandomPosition());
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/fourplay")}
      >
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.title}>Tap the Circle!</Text>
      <Text style={styles.info}>Time Left: {timeLeft}s</Text>
      <Text style={styles.info}>Score: {score}</Text>

      {!gameOver ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleTap}
          style={[
            styles.circle,
            {
              top: position.y,
              left: position.x,
              width: position.size,
              height: position.size,
              borderRadius: position.size / 2,
              backgroundColor: getRandomColor(),
            },
          ]}
        />
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScore}>Your Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const getRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9C4",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF6F00",
  },
  info: {
    fontSize: 20,
    marginVertical: 5,
    color: "#BF360C",
  },
  circle: {
    position: "absolute",
  },
  gameOverContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#D50000",
  },
  finalScore: {
    fontSize: 24,
    marginVertical: 20,
    color: "#4E342E",
  },
  button: {
    backgroundColor: "#FF6F00",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default TapTheCircleGame;
