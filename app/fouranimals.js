import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

export default function AnimalLearningGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animals = [
    { name: "Cat", emoji: "🐈", spell: "C A T" },
    { name: "Dog", emoji: "🐕", spell: "D O G" },
    { name: "Cow", emoji: "🐄", spell: "C O W" },
    { name: "Lion", emoji: "🦁", spell: "L I O N" },
    { name: "Elephant", emoji: "🐘", spell: "E L E P H A N T" },
    { name: "Monkey", emoji: "🐒", spell: "M O N K E Y" },
    { name: "Rabbit", emoji: "🐇", spell: "R A B B I T" },
    { name: "Duck", emoji: "🦆", spell: "D U C K" },
    { name: "Horse", emoji: "🐎", spell: "H O R S E" },
    { name: "Bear", emoji: "🐻", spell: "B E A R" },
  ];

  const current = animals[index];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 1000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // ✅ IMPORTANT: CLEANUP (SCREEN LEAVE PE VOICE BAND)
    return () => {
      Speech.stop();
    };
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E3F2FD", "#FFF3E0"],
  });

  const speak = () => {
    if (speaking) return;

    setSpeaking(true);
    Speech.stop();

    Speech.speak(`This is a ${current.name}`, {
      onDone: () => {
        setTimeout(() => {
          Speech.speak(current.spell, {
            rate: 0.8,
            onDone: () => setSpeaking(false),
          });
        }, 300);
      },
    });

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    speak();
  }, [index]);

  const next = () => {
    if (speaking) return;
    if (index < animals.length - 1) setIndex(index + 1);
    else setShowReward(true);
  };

  const prev = () => {
    if (speaking) return;
    if (index > 0) setIndex(index - 1);
  };

  const restart = () => {
    setIndex(0);
    setShowReward(false);
  };

  // ✅ EXIT FIX (DOUBLE SAFETY)
  const exitToMenu = () => {
    Speech.stop();
    setSpeaking(false);
    setShowPopup(false);

    setTimeout(() => {
      router.push("/four");
    }, 100); // slight delay to ensure stop
  };

  const Popup = () => (
    <View style={styles.popupOverlay}>
      <View style={styles.popupBox}>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
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
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <View style={styles.titleRow}>
        {"LEARN ANIMALS".split("").map((c, i) => (
          <Text key={i} style={[styles.titleChar, { color: `hsl(${i * 22},80%,45%)` }]}>
            {c}
          </Text>
        ))}
      </View>

      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: floatAnim }, { scale: scaleAnim }] }]}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.nameBig}>{current.name}</Text>

      <View style={styles.letters}>
        {current.spell.split(" ").map((l, i) => (
          <View key={i} style={[styles.card, { backgroundColor: `hsl(${i * 40},70%,75%)` }]}>
            <Text style={styles.cardTextBig}>{l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, styles.greyBtn]} onPress={prev} disabled={speaking}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, styles.greyBtn]} onPress={next} disabled={speaking}>
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const RewardUI = () => (
    <View style={styles.rewardContainer}>
      <Text style={styles.rewardEmoji}>🏆</Text>
      <Text style={styles.rewardText}>Great Job!</Text>
      <TouchableOpacity style={styles.restartBtn} onPress={restart}>
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  return showReward ? <RewardUI /> : <GameUI />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  titleRow: { flexDirection: "row", position: "absolute", top: 60 },
  titleChar: { fontSize: 26, fontWeight: "bold" },
  emoji: { fontSize: 160 },
  nameBig: { fontSize: 34, fontWeight: "bold", marginTop: 10, color: "#ff4081" },
  letters: { flexDirection: "row", marginTop: 20 },
  card: { margin: 6, padding: 12, borderRadius: 12 },
  cardTextBig: { fontSize: 26, fontWeight: "bold" },
  nav: { flexDirection: "row", position: "absolute", bottom: 60, gap: 40 },
  navBtn: { padding: 12, borderRadius: 30 },
  greyBtn: { backgroundColor: "#888" },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
    zIndex: 999,
  },
  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },
  rewardEmoji: { fontSize: 110 },
  rewardText: { fontSize: 30, fontWeight: "bold" },
  restartBtn: {
    marginTop: 20,
    backgroundColor: "#FF6F00",
    padding: 12,
    borderRadius: 10,
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    zIndex: 10000,
  },
  popBtn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});