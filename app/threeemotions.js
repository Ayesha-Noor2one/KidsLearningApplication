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

export default function EmotionsLearningGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cardAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current;

  // ✅ EMOTIONS DATA FIXED
  const emotions = [
    { name: "Happy", emoji: "😊", line: "I feel happy" },
    { name: "Sad", emoji: "😢", line: "I feel sad" },
    { name: "Angry", emoji: "😡", line: "I feel angry" },
    { name: "Surprised", emoji: "😲", line: "I feel surprised" },
    { name: "Scared", emoji: "😨", line: "I feel scared" },
    { name: "Sleepy", emoji: "😴", line: "I feel sleepy" },
    { name: "Excited", emoji: "🤩", line: "I feel excited" },
    { name: "Shy", emoji: "☺️", line: "I feel shy" },
    { name: "Love", emoji: "😍", line: "I feel love" },
    { name: "Confused", emoji: "😕", line: "I feel confused" },
  ];

  const current = emotions[index];

  // ✅ BG LOOP
  useEffect(() => {
    const loopBg = () => {
      bgAnim.setValue(0);
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => loopBg());
    };
    loopBg();

    // FLOAT + ROTATE
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: -20,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    return () => Speech.stop();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#d0e8f2", "#fcd5ce", "#d8f3dc"],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-6deg", "6deg"],
  });

  // ✅ SPEAK
  const speak = () => {
    Speech.stop();
    Speech.speak(current.line);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  // ✅ CARDS ANIMATION
  useEffect(() => {
    speak();

    cardAnims.forEach(anim => anim.setValue(0));

    Animated.stagger(
      120,
      current.name.split("").map((_, i) =>
        Animated.spring(cardAnims[i], {
          toValue: 1,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [index]);

  const next = () => {
    if (index < emotions.length - 1) setIndex(index + 1);
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
    setTimeout(() => router.push("/three"), 100);
  };

  const Popup = () => (
    <View style={styles.popupOverlay}>
      <View style={styles.popupBox}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Exit Game?</Text>

        <View style={{ flexDirection: "row", marginTop: 15 }}>
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

      {/* ✅ TITLE FIX */}
      <View style={styles.titleRow}>
        {"EMOTIONS".split("").map((c, i) => (
          <Text key={i} style={[styles.titleChar, { color: `hsl(${i * 22},80%,45%)` }]}>
            {c}
          </Text>
        ))}
      </View>

      {/* EMOJI */}
      <Animated.Text
        style={[
          styles.emoji,
          {
            transform: [
              { translateY: floatAnim },
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.nameBig}>{current.name}</Text>

      {/* LETTER CARDS */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {current.name.split("").map((l, i) => (
          <Animated.View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: `hsl(${i * 40},70%,75%)`,
                opacity: cardAnims[i],
                transform: [
                  {
                    translateY: cardAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardTextBig}>{l}</Text>
          </Animated.View>
        ))}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, styles.greyBtn]} onPress={prev}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, styles.greyBtn]} onPress={next}>
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const RewardUI = () => (
    <View style={styles.rewardContainer}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

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
  card: { margin: 6, padding: 12, borderRadius: 12 },
  cardTextBig: { fontSize: 18, fontWeight: "bold" },
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
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },
  popBtn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});