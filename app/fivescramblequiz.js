import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

export default function ScrambledWordsGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const speak = () => {
    Speech.stop();
    setSpeaking(true);

    Speech.speak(`Spell ${current.word}`, {
      rate: 0.8,
      onDone: () => setSpeaking(false),
    });

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
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

    if (newSelected.join("") === current.word) {
      setTimeout(() => {
        if (index < items.length - 1) {
          setIndex(index + 1);
        } else {
          setShowReward(true);
        }
      }, 600);
    }
  };

  const next = () => {
    if (index < items.length - 1) setIndex(index + 1);
    else setShowReward(true);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const restart = () => {
    setIndex(0);
    setShowReward(false);
  };

  const exitToMenu = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/four");
  };

  const Popup = () => (
    <View style={styles.popupOverlay}>
      <View style={styles.popupBox}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Exit Game?
        </Text>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "red" }]}
            onPress={() => setShowPopup(false)}
          >
            <Text style={{ color: "#fff" }}>No</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "green" }]}
            onPress={exitToMenu}
          >
            <Text style={{ color: "#fff" }}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const GameUI = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      {/* TOP BIG ITEM */}
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

      {/* BLANKS */}
      <View style={styles.blanks}>
        {current.word.split("").map((_, i) => (
          <View key={i} style={styles.blankBox}>
            <Text style={styles.blankText}>
              {selected[i] ? selected[i] : "_"}
            </Text>
          </View>
        ))}
      </View>

      {/* SHUFFLED LETTERS */}
      <View style={styles.letters}>
        {shuffledLetters.map((l, i) => (
          <TouchableOpacity
            key={i}
            style={styles.letterBox}
            onPress={() => handlePress(l)}
          >
            <Text style={styles.letterText}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={prev}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={next}>
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const RewardUI = () => (
    <View style={styles.rewardContainer}>
      <Text style={styles.rewardEmoji}>🏆</Text>
      <Text style={styles.rewardText}>Great Spelling!</Text>

      <TouchableOpacity style={styles.restartBtn} onPress={restart}>
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  return showReward ? <RewardUI /> : <GameUI />;
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FF",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#6C5CE7",
    margin: 6,
    padding: 12,
    borderRadius: 10,
  },

  letterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  nav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    gap: 40,
  },

  navBtn: {
    backgroundColor: "#888",
    padding: 12,
    borderRadius: 30,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8E1",
  },

  rewardEmoji: {
    fontSize: 100,
  },

  rewardText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  restartBtn: {
    marginTop: 20,
    backgroundColor: "#FF6F00",
    padding: 12,
    borderRadius: 10,
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
  },

  popBtn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
});