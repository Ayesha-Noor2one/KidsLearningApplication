import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

/* DATA */
const DATA = [
  { animal: "🐇", name: "Rabbit", food: "🥕", foodName: "Carrot" },
  { animal: "🐕", name: "Dog", food: "🍖", foodName: "Meat" },
  { animal: "🐈", name: "Cat", food: "🐟", foodName: "Fish" },
  { animal: "🐄", name: "Cow", food: "🌿", foodName: "Grass" },
  { animal: "🐒", name: "Monkey", food: "🍌", foodName: "Banana" },
  { animal: "🐼", name: "Panda", food: "🎋", foodName: "Bamboo" },
  { animal: "🐔", name: "Chicken", food: "🌾", foodName: "Grains" },
  { animal: "🐘", name: "Elephant", food: "🍎", foodName: "Apple" },
  { animal: "🦁", name: "Lion", food: "🍖", foodName: "Meat" },
  { animal: "🐸", name: "Frog", food: "🐛", foodName: "Insects" },
];

const FOODS = [
  { emoji: "🥕", name: "Carrot" },
  { emoji: "🍖", name: "Meat" },
  { emoji: "🐟", name: "Fish" },
  { emoji: "🌿", name: "Grass" },
  { emoji: "🍌", name: "Banana" },
  { emoji: "🎋", name: "Bamboo" },
  { emoji: "🌾", name: "Grains" },
  { emoji: "🍎", name: "Apple" },
  { emoji: "🐛", name: "Insects" },
];

const COLORS = ["#FFE3E3", "#E3F2FD", "#E8F5E9", "#FFF9C4", "#F3E5F5"];

/* POPUP */
function Popup({ show, close, yes }) {
  if (!show) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.popupBg}>
        <View style={styles.popupBox}>
          <Text style={styles.popupTitle}> Exit Game?</Text>
         

          <View style={styles.popupRow}>
            <TouchableOpacity style={styles.noBtn} onPress={close}>
              <Text style={styles.popupBtnText}>NO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yesBtn} onPress={yes}>
              <Text style={styles.popupBtnText}>YES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Game() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [showExit, setShowExit] = useState(false);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const bg = useRef(new Animated.Value(0)).current;

  const heart = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;

  const animalScale = useRef(new Animated.Value(1)).current;

  const current = DATA[index];
  const isValid = !!current;

  /* BACKGROUND ANIMATION */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bg, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(bg, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF7E6", "#E6F7FF"],
  });

  /* ANIMAL ANIMATION */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animalScale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animalScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* HEART ANIMATION */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(heart, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(heart, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  /* OPTIONS + SPEECH */
  useEffect(() => {
    if (!isValid) return;

    const correct = FOODS.find(f => f.emoji === current.food);

    let opts = [correct];
    while (opts.length < 3) {
      let r = FOODS[Math.floor(Math.random() * FOODS.length)];
      if (!opts.find(o => o.emoji === r.emoji)) opts.push(r);
    }

    setOptions(opts.sort(() => Math.random() - 0.5));

    Speech.stop();
    setTimeout(() => {
      Speech.speak(`give ${current.foodName} to ${current.name}`);
    }, 150);
  }, [index]);

  /* ANIMATIONS */
  const bounce = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.5, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const shakeAnim = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (item) => {
    if (!isValid) return;

    if (item.emoji === current.food) {
      setRight(r => r + 1);
      bounce();
      setTimeout(() => setIndex(i => i + 1), 500);
    } else {
      setWrong(w => w + 1);
      shakeAnim();
    }
  };

  /* REWARD */
  if (!isValid) {
    return (
      <View style={styles.reward}>

        <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Popup
          show={showExit}
          close={() => setShowExit(false)}
          yes={() => router.push("/four")}
        />

        <Text style={styles.great}>🎉 Great Job!</Text>

        <Animated.Text
          style={[
            styles.heart,
            { transform: [{ scale: heart }], opacity: heartOpacity }
          ]}
        >
          💙
        </Animated.Text>

        <Text style={styles.scoreText}>✔ {right} ❌ {wrong}</Text>

        <TouchableOpacity
          style={styles.playAgain}
          onPress={() => {
            setIndex(0);
            setRight(0);
            setWrong(0);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      
      <Popup
        show={showExit}
        close={() => setShowExit(false)}
        yes={() => router.push("/four")}
      />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🍽 FEED THE ANIMALS</Text>

      <Text style={styles.hint}>
        give {current.foodName} {current.food} to {current.name}
      </Text>

      <Animated.Text
        style={[
          styles.animal,
          { transform: [{ scale: animalScale }, { translateX: shake }] }
        ]}
      >
        {current.animal}
      </Animated.Text>

      <View style={styles.row}>
        {options.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.circle, { backgroundColor: COLORS[i % COLORS.length] }]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
      </View>

    </Animated.View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  title: {
    position: "absolute",
    top: 55,
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6B6B",
  },

  hint: {
    fontSize: 28,
    marginTop: 80,
    fontWeight: "700",
    textAlign: "center",
  },

  animal: { fontSize: 140, marginTop: 20 },

  row: { flexDirection: "row", marginTop: 30 },

  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },

  emoji: { fontSize: 38 },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
  },

  score: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    gap: 20,
  },

  reward: { flex: 1, justifyContent: "center", alignItems: "center" },

  great: { fontSize: 32, fontWeight: "bold" },

  heart: { fontSize: 120, marginVertical: 10 },

  scoreText: { fontSize: 22 },

  playAgain: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
  },

  popupBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  popupTitle: { fontSize: 20, fontWeight: "bold" },

  popupText: { marginVertical: 10, textAlign: "center" },

  popupRow: { flexDirection: "row", gap: 20 },

 noBtn: {
  backgroundColor: "#4CAF50", // green
  padding: 10,
  borderRadius: 10,
  width: 70,
  alignItems: "center",
},

  yesBtn: { backgroundColor: "#c93d3dff", padding: 10, borderRadius: 10 },

  popupBtnText: { color: "#fff", fontWeight: "bold" },
});