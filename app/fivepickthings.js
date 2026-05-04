import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const LEVELS = [
  { rule: "Pick FRUITS", correct: ["🍎", "🍌", "🍇"], wrong: ["🚙", "🐶", "⚽"], bg: "#FFD6E8" },
  { rule: "Pick VEGETABLES", correct: ["🥕", "🥦", "🌽", "🥒"], wrong: ["🍩", "🚀", "🎈"], bg: "#D9FFD6" },
  { rule: "Pick ANIMALS", correct: ["🐶", "🐼", "🐰", "🦁"], wrong: ["🍎", "🚂", "🎁"], bg: "#C7F9FF" },
  { rule: "Pick ROUND THINGS", correct: ["⚽", "🌕", "🪙"], wrong: ["📘", "🚗", "🌲"], bg: "#FFF4B8" },
  { rule: "Pick SWEET THINGS", correct: ["🍩", "🍭", "🧁"], wrong: ["🚙", "🐻", "📚"], bg: "#FFE0E0" },
  { rule: "Pick THINGS THAT FLY", correct: ["🦋", "✈️", "🐦"], wrong: ["🚗", "🍎", "⚽"], bg: "#E0D4FF" },
  { rule: "Pick THINGS IN SKY", correct: ["☁️", "🌙", "⭐", "☀️"], wrong: ["🍎", "📦"], bg: "#D6F5FF" },
  { rule: "Pick WATER THINGS", correct: ["🐟", "🐳", "🦀"], wrong: ["🚗", "🌵", "🍪"], bg: "#BDEFFF" },
  { rule: "Pick SCHOOL THINGS", correct: ["📚", "✏️", "🖍️"], wrong: ["🍕", "🐶", "🚀"], bg: "#FFF0C9" },
  { rule: "Pick TOYS", correct: ["🧸", "🎲", "🪀"], wrong: ["🥦", "🚂", "🌳"], bg: "#F8D8FF" },
  { rule: "Pick THINGS TO EAT", correct: ["🍕", "🍔", "🍟"], wrong: ["📘", "🚁", "🎈"], bg: "#FFE4C4" },
  { rule: "Pick THINGS TO WEAR", correct: ["👕", "👟", "🧢"], wrong: ["🍉", "🚙", "🐰"], bg: "#D4F8E8" },
];
export default function RuleGame() {
  const router = useRouter();

  const [level, setLevel] = useState(0);
  const [items, setItems] = useState([]);
  const [collected, setCollected] = useState([]);
  const [showExit, setShowExit] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const current = LEVELS[level];

  useEffect(() => {
    if (!showReward) {
      const mix = [...current.correct, ...current.wrong].sort(() => Math.random() - 0.5);
      setItems(mix);
      setCollected([]);

      Speech.stop();
      Speech.speak(current.rule);

      Animated.timing(bgAnim, {
        toValue: level,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [level, showReward]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: [
      "#FFD6E8",
      "#D9FFD6",
      "#C7F9FF",
      "#FFF4B8",
      "#FFE0E0",
      "#E0D4FF",
    ],
  });

  const correctAnim = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.25, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const wrongAnim = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    setCollected([]);
    setWrong((w) => w + 1);
    Speech.speak("Oops!");
  };

  const showRewardScreen = () => {
    setShowReward(true);

    Animated.loop(
      Animated.sequence([
        Animated.timing(flowerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flowerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const nextLevel = () => {
    if (level + 1 < LEVELS.length) {
      setTimeout(() => setLevel((p) => p + 1), 800);
    } else {
      setTimeout(showRewardScreen, 800);
    }
  };

  const onPress = (item) => {
    if (current.correct.includes(item)) {
      if (!collected.includes(item)) {
        const updated = [...collected, item];
        setCollected(updated);
        correctAnim();
        setRight((r) => r + 1);

        if (updated.length === current.correct.length) nextLevel();
      }
    } else {
      wrongAnim();
    }
  };

  const playAgain = () => {
    setLevel(0);
    setCollected([]);
    setRight(0);
    setWrong(0);
    setShowReward(false);
  };

  const ExitModal = () => (
    <Modal transparent visible={showExit} animationType="fade">
      <View style={styles.modalWrap}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Exit game?</Text>

          <View style={styles.modalBtns}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#1c8107ff" }]}
              onPress={() => router.push("/five")}
            >
              <Text style={styles.btnTxt}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#d1250eff" }]}
              onPress={() => setShowExit(false)}
            >
              <Text style={styles.btnTxt}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (showReward) {
    return (
      <View style={styles.rewardContainer}>
        <TouchableOpacity style={styles.back} onPress={() => setShowExit(true)}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>

        <Text style={styles.rewardTitle}>🌟 GOOD JOB 🌟</Text>

        <Animated.Text
          style={[
            styles.flower,
            {
              transform: [
                {
                  scale: flowerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  }),
                },
              ],
            },
          ]}
        >
          🌸
        </Animated.Text>

        <Text style={styles.stats}>✔ : {right}</Text>
        <Text style={styles.stats}>❌ : {wrong}</Text>

        <TouchableOpacity style={styles.playAgain} onPress={playAgain}>
          <Text style={styles.playTxt}>Play Again</Text>
        </TouchableOpacity>

        <ExitModal />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.back} onPress={() => setShowExit(true)}>
        <Text style={styles.backTxt}>←</Text>
      </TouchableOpacity>

      <Text style={styles.rule}>{current.rule}</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.grid}>
          {items.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => onPress(item)}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: collected.includes(item) ? 0.3 : 1,
                    width: 80 + level * 5,
                    height: 80 + level * 5,
                  },
                ]}
              >
                <Text style={styles.emoji}>{item}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <View style={styles.bar}>
        <Text style={styles.barTitle}>
          Collected {collected.length}/{current.correct.length}
        </Text>
        <View style={styles.collectRow}>
          {collected.map((c, i) => (
            <Text key={i} style={styles.collectEmoji}>{c}</Text>
          ))}
        </View>
      </View>

      <View style={styles.score}>
        <Text style={styles.scoreTxt}>✔ {right}</Text>
        <Text style={styles.scoreTxt}>❌ {wrong}</Text>
      </View>

      <ExitModal />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 80 },

  back: {
    position: "absolute",
    top: 35,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    padding: 10,
    zIndex: 999,
  },

  backTxt: { fontSize: 28, color: "#fff", fontWeight: "bold" },

  rule: { fontSize: 24, fontWeight: "bold", marginBottom: 40 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: width * 0.95,
  },

  card: {
    borderRadius: 100,
    backgroundColor: "#fff",
    margin: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  emoji: { fontSize: 34 },

  bar: {
    position: "absolute",
    bottom: 90,
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    elevation: 8,
  },

  barTitle: { fontWeight: "bold", fontSize: 18 },

  collectRow: { flexDirection: "row", marginTop: 8 },

  collectEmoji: { fontSize: 30, marginRight: 10 },

  score: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    gap: 25,
  },

  scoreTxt: { fontSize: 22, fontWeight: "bold" },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },

  modalText: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  modalBtns: { flexDirection: "row", gap: 15 },

  btn: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 20 },

  btnTxt: { color: "#fff", fontWeight: "bold" },

  rewardContainer: {
    flex: 1,
    backgroundColor: "#FFF9DB",
    justifyContent: "center",
    alignItems: "center",
  },

  rewardTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#ff6368",
  },

  flower: { fontSize: 120, marginBottom: 30 },

  stats: { fontSize: 24, marginBottom: 10 },

  playAgain: {
    marginTop: 30,
    backgroundColor: "#6C63FF",
    padding: 18,
    borderRadius: 25,
  },

  playTxt: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});