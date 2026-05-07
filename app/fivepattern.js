import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Pattern Quiz";

export default function PatternGame() {
  const router = useRouter();

  const [pattern, setPattern] = useState([]);
  const [options, setOptions] = useState([]);
  const [correct, setCorrect] = useState(null);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [level, setLevel] = useState(1);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const emojiAnim = useRef(new Animated.Value(1)).current;
  const flowerAnim = useRef(new Animated.Value(1)).current;
  const optionAnim = useRef(new Animated.Value(1)).current;

 const patterns = [
  ["❓", "✈️", "🚗", "✈️", "🚗"],
  ["🐶", "❓", "🐶", "🐱", "🐶"],
  ["☀️", "🌙", "❓", "🌙", "☀️"],
  ["⚽", "🏀", "⚽", "❓", "⚽"],
  ["⭐", "🎈", "⭐","🎈", "❓"],

  ["🍔", "❓", "🍔", "🍕", "🍔"],
  ["🚀", "🛸", "❓", "🛸", "🚀"],
  ["❓", "🐼", "🐸", "🐼", "🐸"],
  ["🎵", "🎸", "🎵", "❓", "🎵"],
  ["🚕", "🚌", "🚕", "🚌", "❓"],

  ["❓", "🌻", "🌸", "🌻", "🌸"],
  ["🍎", "❓", "🍎", "🍌", "🍎"],
  ["👑", "💎", "❓", "💎", "👑"],
  ["🦋", "🐝", "🦋", "❓", "🦋"],
  ["🎂", "🎁", "🎂", "🎁", "❓"],

  ["❄️", "🔥", "❓", "🔥", "❄️"],
  ["📚", "✏️", "📚", "❓", "📚"],
  ["❓", "🐙", "🐠", "🐙", "🐠"],
  ["🌈", "☁️", "🌈", "❓", "🌈"],
  
];

const answers = [
  "🚗",
  "🐱",
  "☀️",
  "🏀",
  "⭐",
  "🍕",
  "🚀",
  "🐸",
  "🎸",
  "🚕",
  "🌸",
  "🍌",
  "👑",
  "🐝",
  "🎂",
  "❄️",
  "✏️",
  "🐠",
  "☁️",
  "🎠",
];

  useEffect(() => {
    generatePattern();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(emojiAnim, { toValue: 1.25, useNativeDriver: true }),
        Animated.spring(emojiAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(optionAnim, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(optionAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  }, [level]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#DFF6FF", "#FFE5F1"],
  });

  const generatePattern = () => {
    if (level > patterns.length) {
      saveProgress();
      setShowResult(true);

      Animated.loop(
        Animated.sequence([
          Animated.spring(flowerAnim, { toValue: 1.4, useNativeDriver: true }),
          Animated.spring(flowerAnim, { toValue: 1, useNativeDriver: true }),
        ])
      ).start();
      return;
    }

    setPattern(patterns[level - 1]);
    setCorrect(answers[level - 1]);

    let opts = [answers[level - 1], "🎁", "🚀"];
    opts = opts.sort(() => Math.random() - 0.5);
    setOptions(opts);

    Speech.speak("Find the missing item");
  };

  const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      
      await addQuizResult(kidId, quiz, right,wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const onPress = (item) => {
    if (item === correct) {
      Speech.speak("Good JOb");
      setRight((r) => r + 1);
      setTimeout(() => setLevel((l) => l + 1), 600);
    } else {
      Speech.speak("Try again");
      setWrong((w) => w + 1);
      shake();
    }
  };

  const restart = () => {
    setRight(0);
    setWrong(0);
    setLevel(1);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <View style={[styles.container, { backgroundColor: "#FFF7E0" }]}>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setShowPopup(true)}
        >
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.rewardTitle}>🎉 AMAZING 🎉</Text>

        <Animated.Text
          style={{ fontSize: 150, transform: [{ scale: flowerAnim }] }}
        >
          🌼
        </Animated.Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>✔ {right}</Text>
          <Text style={styles.scoreText}>❌ {wrong}</Text>
        </View>

        <TouchableOpacity style={styles.playBtn} onPress={restart}>
          <Text style={{ color: "#fff", fontSize: 18 }}>Play Again</Text>
        </TouchableOpacity>

        <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>✨ PATTERN MAGIC ✨</Text>
      <Text style={styles.hint}>Guess the missing item!</Text>

      <Animated.View
        style={[styles.patternRow, { transform: [{ translateX: shakeAnim }] }]}
      >
        {pattern.map((item, index) => (
          <Animated.View
            key={index}
            style={[styles.box, { transform: [{ scale: emojiAnim }] }]}
          >
            <Text style={styles.emoji}>{item}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <Animated.View
            key={i}
            style={{ transform: [{ scale: optionAnim }] }}
          >
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => onPress(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
        <Text>Level {level}</Text>
      </View>

      <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
    </Animated.View>
  );
}

function Popup({ show, close, router }) {
  return (
    <Modal transparent visible={show}>
      <View style={styles.popup}>
        <View style={styles.popupBox}>
          <Text style={{ fontSize: 18 }}>Exit Game?</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#ff4d4d" }]} onPress={close}>
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#00c853" }]}
              onPress={() => router.push("/five")}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    position: "absolute",
    top: 65,
    fontSize: 30,
    fontWeight: "bold",
    color: "#18d832ff",
  },

  hint: { fontSize: 22, color: "#444", marginBottom: 25 },

  patternRow: { flexDirection: "row", marginVertical: 30 },

  box: {
    width: 65,
    height: 80,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    borderWidth: 3,
    borderColor: "#A29BFE",
  },

  emoji: { fontSize: 38 },

  options: { flexDirection: "row", marginTop: 20 },

  optionBtn: {
    backgroundColor: "#fff",
    padding: 18,
    margin: 12,
    borderRadius: 18,
    elevation: 5,
    borderColor: "#A29BFE",
  },

  optionText: { fontSize: 34 },

  score: {
    position: "absolute",
    bottom: 35,
    flexDirection: "row",
    gap: 20,
  },

  backBtn: {
    position: "absolute",
    top: 35,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 25,
  },

  popup: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },

  btn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  rewardTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 20,
  },

  scoreRow: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },

  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  playBtn: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 14,
    marginTop: 25,
  },
});