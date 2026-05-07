import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from "./database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const quiz = "Scramble Quiz";

const COLORS = [
  "#FF7675",
  "#74B9FF",
  "#55EFC4",
  "#FFEAA7",
  "#A29BFE",
  "#FD79A8",
];

export default function ScrambledWordsGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const items = [
    { emoji: "🍎", word: "APPLE" },
    { emoji: "🐶", word: "DOG" },
    { emoji: "🐱", word: "CAT" },
    { emoji: "🚗", word: "CAR" },
    { emoji: "🐟", word: "FISH" },
    { emoji: "🌙", word: "MOON" },
  ];

  const current = items[index];
  const shuffledLetters = useRef([]).current;

  if (shuffledLetters.length === 0 || shuffledLetters.word !== current.word) {
    shuffledLetters.splice(0);

    const arr = current.word.split("");
    const shuffled = arr
      .map((v) => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);

    shuffledLetters.push(...shuffled);
    shuffledLetters.word = current.word;
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F3F6FF", "#FFF3E0"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const speak = async () => {
    await Speech.stop();

    setSpeaking(true);

    Speech.speak(`Spell ${current.word}`, {
      rate: 0.8,
      onDone: () => setSpeaking(false),
    });

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    setSelected([]);
    speak();
  }, [index]);

  const handlePress = (letter) => {
    if (speaking) return;

    const newSelected = [...selected, letter];
    setSelected(newSelected);

    const typed = newSelected.join("");

    if (!current.word.startsWith(typed)) {
      setWrong((w) => w + 1);
      setSelected([]);
      return;
    }

    if (typed === current.word) {
      setRight((r) => r + 1);

      setTimeout(() => {
        if (index < items.length - 1) {
          setIndex(index + 1);
        } else {
          endIt();
        }
      }, 600);
    }
  };

  const endIt = async () => {
    await saveProgress();
    setShowReward(true);
  };

  const saveProgress = async () => {
    const kidId = await AsyncStorage.getItem("kidId");
    console.log(kidId);
    console.log(quiz);
    console.log(right);
    console.log(wrong);
    
    
    await addQuizResult(kidId, quiz, right, wrong);
  };

  const restart = () => {
    setIndex(0);
    setSelected([]);
    setRight(0);
    setWrong(0);
    setShowReward(false);
  };

  const exitToMenu = async () => {
    await Speech.stop();
    setShowPopup(false);
    router.push("/five");
  };

  const Popup = () => (
    <View style={styles.popupOverlay}>
      <View style={styles.popupBox}>
        <Text style={styles.popupTitle}>Exit Game?</Text>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "#E74C3C" }]}
            onPress={() => setShowPopup(false)}
          >
            <Text style={styles.popText}>No</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "#2ECC71" }]}
            onPress={exitToMenu}
          >
            <Text style={styles.popText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const RewardUI = () => (
    <View style={styles.rewardContainer}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          Speech.stop();
          setShowPopup(true);
        }}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <Text style={styles.rewardEmoji}>🏆</Text>
      <Text style={styles.rewardText}>Great Job!</Text>

      <Text style={styles.scoreText}>
        ✔ {right}     ❌ {wrong}
      </Text>

      <TouchableOpacity style={styles.restartBtn} onPress={restart}>
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (showReward) return <RewardUI />;

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          Speech.stop();
          setShowPopup(true);
        }}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <Text style={styles.title}>SPELL THE WORD</Text>

      <Animated.Text
        style={[
          styles.emoji,
          {
            transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {current.emoji}
      </Animated.Text>

      <View style={styles.blanks}>
        {current.word.split("").map((_, i) => (
          <View key={i} style={styles.blankBox}>
            <Text style={styles.blankText}>
              {selected[i] ? selected[i] : "_"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.letters}>
        {shuffledLetters.map((l, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.letterBox,
              { backgroundColor: COLORS[i % COLORS.length] },
            ]}
            onPress={() => handlePress(l)}
          >
            <Text style={styles.letterText}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.score}>
        <Text style={styles.scoreText}>✔ {right}</Text>
        <Text style={styles.scoreText}>❌ {wrong}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    position: "absolute",
    top: 55,
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C5CE7",
  },

  emoji: {
    fontSize: 140,
    marginBottom: 20,
  },

  blanks: {
    flexDirection: "row",
    marginBottom: 25,
  },

  blankBox: {
    width: 45,
    height: 45,
    borderBottomWidth: 3,
    borderColor: "#333",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  blankText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  letters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  letterBox: {
    margin: 6,
    padding: 14,
    borderRadius: 12,
  },

  letterText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  score: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    gap: 25,
  },

  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
  },

  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },

  rewardEmoji: {
    fontSize: 120,
  },

  rewardText: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
  },

  restartBtn: {
    marginTop: 20,
    backgroundColor: "#FF6F00",
    padding: 14,
    borderRadius: 12,
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  popBtn: {
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },

  popText: {
    color: "#fff",
    fontWeight: "bold",
  },
});