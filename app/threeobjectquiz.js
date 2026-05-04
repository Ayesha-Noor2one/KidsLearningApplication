import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";

/* 🍎 WORD BANK */
const WORDS = [
  { word: "APPLE", emoji: "🍎" },
  { word: "BANANA", emoji: "🍌" },
  { word: "MANGO", emoji: "🥭" },
  { word: "CARROT", emoji: "🥕" },
  { word: "GRAPES", emoji: "🍇" },
];

export default function WordBuildGame() {
  const [index, setIndex] = useState(0);

  const current = WORDS[index];

  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);

  const [locked, setLocked] = useState(false);
  const [popup, setPopup] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;

  /* 🔀 SHUFFLE */
  const shuffleWord = () => {
    const arr = current.word.split("");
    setShuffled(arr.sort(() => Math.random() - 0.5));
    setSelected([]);
  };

  useEffect(() => {
    shuffleWord();
    Speech.speak(`Make ${current.word}`);
  }, [index]);

  /* 🧠 SELECT LETTER */
  const pickLetter = (l, i) => {
    if (locked) return;

    const newSelected = [...selected, l];
    setSelected(newSelected);

    if (newSelected.join("") === current.word) {
      Speech.speak("Good job!");
      setLocked(true);

      setTimeout(() => {
        if (index < WORDS.length - 1) {
          setIndex(index + 1);
        } else {
          setIndex(0);
        }
      }, 800);
    }
  };

  /* ❌ SHAKE */
  const wrong = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* 🧹 REMOVE LETTER */
  const remove = (i) => {
    let copy = [...selected];
    copy.splice(i, 1);
    setSelected(copy);
  };

  return (
    <View style={styles.container}>

      {/* BACKGROUND TITLE */}
      <Text style={styles.title}>🧠 Build the Word</Text>

      {/* ICON */}
      <Text style={styles.emoji}>{current.emoji}</Text>

      {/* SELECTED WORD AREA */}
      <View style={styles.selectedBox}>
        {Array.from({ length: current.word.length }).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => remove(i)}>
            <View style={styles.slot}>
              <Text style={styles.slotText}>
                {selected[i] || "_"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* SHUFFLED LETTERS */}
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <View style={styles.grid}>
          {shuffled.map((l, i) => (
            <TouchableOpacity key={i} onPress={() => pickLetter(l, i)}>
              <View style={styles.box}>
                <Text style={styles.letter}>{l}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* LIGHT HINT ROW */}
      <View style={styles.hintRow}>
        {current.word.split("").map((l, i) => (
          <Text key={i} style={styles.hint}>{l}</Text>
        ))}
      </View>

      {/* NEXT / RESET */}
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => {
          setIndex((i) => (i + 1) % WORDS.length);
        }}
      >
        <Text style={{ color: "#fff" }}>Next</Text>
      </TouchableOpacity>

    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF7FF",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    position: "absolute",
    top: 60,
  },

  emoji: {
    fontSize: 100,
    marginBottom: 20,
  },

  selectedBox: {
    flexDirection: "row",
    marginBottom: 20,
  },

  slot: {
    width: 45,
    height: 45,
    margin: 5,
    borderBottomWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  slotText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  box: {
    width: 60,
    height: 60,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  letter: {
    fontSize: 22,
    fontWeight: "bold",
  },

  hintRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  hint: {
    fontSize: 18,
    margin: 2,
    color: "#ccc",
  },

  nextBtn: {
    marginTop: 30,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 20,
  },
});