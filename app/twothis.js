import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const INITIAL_SIZE = 100; // starting circle size
const MAX_SIZE = Math.min(width, height) * 0.8; // limit for circle growth

const COLORS = [
  "#FF6B6B",
  "#6A5ACD",
  "#20B2AA",
  "#FFD93D",
  "#FF69B4",
  "#4ECDC4",
  "#FFA500",
];

export default function GameForTwoYear() {
  const [circleSize, setCircleSize] = useState(INITIAL_SIZE);
  const [colorIndex, setColorIndex] = useState(0);
  const [showStars, setShowStars] = useState([]);
  const starsAnim = useRef([]).current;
  const scale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const onTap = () => {
    if (circleSize >= MAX_SIZE) return;

    // Bounce animation
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Increase circle size
    const newSize = circleSize + 40; // grow step
    if (newSize >= MAX_SIZE) {
      setCircleSize(MAX_SIZE);
      showEndPopup();
    } else {
      setCircleSize(newSize);
    }

    // Change color
    let next = Math.floor(Math.random() * COLORS.length);
    if (next === colorIndex) next = (next + 1) % COLORS.length;
    setColorIndex(next);

    // Show stars
    createStars();
  };

  const showEndPopup = () => {
    Alert.alert(
      "🎉 Congrats!",
      "You have filled the circle!",
      [
        { text: "Replay", onPress: () => resetGame() },
        { text: "Back", onPress: () => router.push("/twoplay") },
      ],
      { cancelable: false }
    );
  };

  const resetGame = () => {
    setCircleSize(INITIAL_SIZE);
    setColorIndex(0);
    setShowStars([]);
  };

  const createStars = () => {
    const newStars = [];
    for (let i = 0; i < 5; i++) {
      const id = Date.now().toString() + i;
      const anim = new Animated.Value(0);
      starsAnim[id] = anim;
      newStars.push({ id, anim, left: circleSize / 2 + (Math.random() * 80 - 40) });
    }
    setShowStars((prev) => [...prev, ...newStars]);

    newStars.forEach((s) => {
      Animated.timing(s.anim, {
        toValue: 1,
        duration: 800 + Math.random() * 300,
        useNativeDriver: true,
      }).start(() => {
        setShowStars((prev) => prev.filter((p) => p.id !== s.id));
        delete starsAnim[s.id];
      });
    });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/twoplay")}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Fill the Circle!</Text>

        <TouchableWithoutFeedback onPress={onTap}>
          <Animated.View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: COLORS[colorIndex],
                transform: [{ scale }],
              },
            ]}
          >
            <Text style={styles.circleEmoji}>🌟</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* Floating Stars */}
        {showStars.map((s) => {
          const translateY = s.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -120 - Math.random() * 60],
          });
          const opacity = s.anim.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [1, 1, 0],
          });
          const scaleStar = s.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1.2],
          });
          const leftOffset = s.left - circleSize / 2;
          return (
            <Animated.Text
              key={s.id}
              style={[
                styles.star,
                {
                  left: width / 2 - circleSize / 2 + leftOffset,
                  top: height / 2 - circleSize / 2 + 20,
                  transform: [{ translateY }, { scale: scaleStar }],
                  opacity,
                },
              ]}
            >
              ⭐
            </Animated.Text>
          );
        })}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#FFF" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#0005",
    padding: 8,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    color: "#fff",
    backgroundColor: "#0005",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  circleEmoji: {
    fontSize: 50,
    color: "#fff",
    textAlign: "center",
  },
  star: {
    position: "absolute",
    fontSize: 22,
  },
});
