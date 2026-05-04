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

export default function GoodHabitsLearningGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cardAnims = useRef(
    [...Array(5)].map(() => new Animated.Value(0))
  ).current;

  const habits = [
    {
      name: "Brush Teeth",
      emoji: "🪥",
      extra: "😁",
      line: "You should brush your teeth regularly",
    },
    {
      name: "Wash Hands",
      emoji: "🧼",
      extra: "🚿",
      line: "You should wash your hands before eating",
    },
    {
      name: "Take Bath",
      emoji: "🛁",
      extra: "🫧",
      line: "You should take bath regularly",
    },
    {
      name: "Eat Healthy",
      emoji: "🥗",
      extra: "🍎",
      line: "You should eat healthy food",
    },
    {
      name: "Drink Water",
      emoji: "💧",
      extra: "🥤",
      line: "You should drink water daily",
    },
    {
      name: "Sleep Early",
      emoji: "😴",
      extra: "🌙",
      line: "You should sleep early",
    },
    {
      name: "Say Thank You",
      emoji: "🙏",
      extra: "😊",
      line: "You should say thank you",
    },
    {
      name: "Help Others",
      emoji: "🤝",
      extra: "❤️",
      line: "You should help others",
    },
    {
      name: "Keep Clean",
      emoji: "🧹",
      extra: "✨",
      line: "You should keep yourself clean",
    },
    {
      name: "Be Kind",
      emoji: "😊",
      extra: "💖",
      line: "You should be kind",
    },
  ];

  const current = habits[index];

  // 🎨 BG SMOOTH LOOP
  useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(() => loop());
    };
    loop();

    // FLOATING LOOP (emoji + icon)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 1200,
          useNativeDriver: true,
        }),
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

  // 🔊 SPEECH FIXED
  const speak = () => {
    Speech.stop();
    Speech.speak(current.line, { rate: 0.9 });

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    speak();

    cardAnims.forEach((a) => a.setValue(0));

    Animated.stagger(
      120,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [index]);

  const next = () => {
    if (index < habits.length - 1) setIndex(index + 1);
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

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setShowPopup(true)}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <View style={styles.titleRow}>
        {"GOOD HABITS".split("").map((c, i) => (
          <Text
            key={i}
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: `hsl(${i * 30},80%,50%)`,
            }}
          >
            {c}
          </Text>
        ))}
      </View>

      {/* FLOATING EMOJI */}
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

      {/* FLOATING EXTRA ICON */}
      <Animated.Text
        style={{
          fontSize: 50,
          transform: [{ translateY: floatAnim }],
        }}
      >
        {current.extra}
      </Animated.Text>

      <Text style={styles.nameBig}>{current.name}</Text>

      {/* CARDS */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {current.name.split(" ").map((l, i) => (
          <Animated.View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: `hsl(${i * 40},70%,75%)`,
                transform: [
                  {
                    translateY: cardAnims[i]?.interpolate({
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

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={prev}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={next}>
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const RewardUI = () => (
    <View style={styles.rewardContainer}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setShowPopup(true)}
      >
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
  emoji: { fontSize: 160 },
  nameBig: { fontSize: 34, fontWeight: "bold", marginTop: 10 },

  card: { margin: 6, padding: 12, borderRadius: 12 },
  cardTextBig: { fontSize: 18, fontWeight: "bold" },

  nav: {
  flexDirection: "row",
  position: "absolute",
  bottom: 60,
  gap: 25, },
  navBtn: { backgroundColor: "#888", padding: 12, borderRadius: 30 },

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