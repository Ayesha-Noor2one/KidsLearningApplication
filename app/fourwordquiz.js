import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const WORDS = [
  { word: "APPLE", emoji: "🍎" },
  { word: "CAR", emoji: "🚗" },
  { word: "BALL", emoji: "⚽" },
  { word: "DOG", emoji: "🐶" },
  { word: "BOOK", emoji: "📘" },
  { word: "CHAIR", emoji: "🪑" },
  { word: "PHONE", emoji: "📱" },
  { word: "STAR", emoji: "⭐" },
];

export default function WordBuildGame() {
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const current = WORDS[index];

  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lockedIndexes, setLockedIndexes] = useState([]);

  const [locked, setLocked] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const [right, setRight] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const shake = useRef(new Animated.Value(0)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#EAF7FF", "#FFF3E0"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(emojiAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const emojiScale = emojiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const shuffleWord = () => {
    const arr = current.word.split("");
    setShuffled(arr.sort(() => Math.random() - 0.5));
    setSelected([]);
    setLockedIndexes([]);
    setLocked(false);
  };

  useEffect(() => {
    shuffleWord();
    Speech.speak(`Make ${current.word}`);
  }, [index]);

  const pickLetter = (l) => {
    if (locked) return;

    const newSelected = [...selected, l];

    if (!current.word.startsWith(newSelected.join(""))) {
      wrong();
      setWrongCount((w) => w + 1);
      return;
    }

    setSelected(newSelected);
    setLockedIndexes((prev) => [...prev, newSelected.length - 1]);

    if (newSelected.join("") === current.word) {
      setLocked(true);
      setRight((r) => r + 1);

      setTimeout(() => {
        if (index < WORDS.length - 1) setIndex(index + 1);
        else setShowReward(true);
      }, 800);
    }
  };

  const wrong = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const remove = (i) => {
    if (lockedIndexes.includes(i)) return;
    let copy = [...selected];
    copy.splice(i, 1);
    setSelected(copy);
  };

  if (showReward)
    return (
      <RewardScreen
        right={right}
        navigation={navigation}
        setShowReward={setShowReward}
        setIndex={setIndex}
        setRight={setRight}
        setWrongCount={setWrongCount}
      />
    );

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🧠 Build the Word</Text>

      <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScale }] }]}>
        {current.emoji}
      </Animated.Text>

      <View style={styles.selectedBox}>
        {Array.from({ length: current.word.length }).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => remove(i)}>
            <View style={styles.slot}>
              <Text style={styles.slotText}>{selected[i] || "_"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <View style={styles.grid}>
          {shuffled.map((l, i) => (
            <TouchableOpacity key={i} onPress={() => pickLetter(l)}>
              <View style={[styles.box, { backgroundColor: ["#FF6B6B","#4ECDC4","#FFD93D","#6C5CE7","#00C853"][i % 5] }]}>
                <Text style={styles.letter}>{l}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <View style={styles.hintRow}>
        {current.word.split("").map((l, i) => (
          <Text key={i} style={styles.hint}>{l}</Text>
        ))}
      </View>

      <View style={styles.bottomScore}>
        <Text>✅ {right}</Text>
        <Text>❌ {wrongCount}</Text>
      </View>

      {showExit && (
        <View style={styles.modal}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Exit Game?</Text>

            <View style={styles.popupBtns}>
              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#2ecc71" }]}
                onPress={() => navigation.navigate("four")}
              >
                <Text style={styles.popupText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#e74c3c" }]}
                onPress={() => setShowExit(false)}
              >
                <Text style={styles.popupText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const RewardScreen = ({ right, navigation, setShowReward, setIndex, setRight, setWrongCount }) => {
  const heart = useRef(new Animated.Value(0)).current;
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heart, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(heart, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scale = heart.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Animated.Text style={{ fontSize: 80, transform: [{ scale }] }}>💗</Animated.Text>
      <Text style={{ fontSize: 26, marginTop: 10 }}>Great Job!</Text>
      <Text style={{ marginTop: 20 }}>✅ {right}</Text>

      <TouchableOpacity
        style={styles.playAgain}
        onPress={() => {
          setIndex(0);
          setRight(0);
          setWrongCount(0);
          setShowReward(false);
        }}
      >
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>

    
      {showExit && (
        <View style={styles.modal}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Exit Game?</Text>

            <View style={styles.popupBtns}>
              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#2ecc71" }]}
                onPress={() => navigation.navigate("four")}
              >
                <Text style={styles.popupText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#e74c3c" }]}
                onPress={() => setShowExit(false)}
              >
                <Text style={styles.popupText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
  },
  title: { fontSize: 26, position: "absolute", top: 60 },
  emoji: { fontSize: 100, marginBottom: 20 },
  selectedBox: { flexDirection: "row", marginBottom: 20 },
  slot: {
    width: 45,
    height: 45,
    margin: 5,
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  slotText: { fontSize: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  box: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  letter: { fontSize: 22, color: "#fff", fontWeight: "bold" },
  hintRow: { flexDirection: "row", marginTop: 20 },
  hint: { fontSize: 22, margin: 3, color: "#bbb" },
  bottomScore: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    width: 120,
    justifyContent: "space-between",
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "75%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  popupBtns: {
    flexDirection: "row",
    width: "100%",
  },
  popupBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  popupText: {
    color: "#fff",
    fontWeight: "bold",
  },
  playAgain: {
    marginTop: 30,
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 20,
  },
});