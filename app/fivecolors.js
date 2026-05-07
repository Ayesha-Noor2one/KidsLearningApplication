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

export default function ColorLearningGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;

  const colors = [
    { name: "Red", hex: "#FF4D4D", emoji: "🔴", items: [{ icon: "🍎", name: "Apple" }, { icon: "🚗", name: "Car" }] },
    { name: "Blue", hex: "#4D79FF", emoji: "🔵", items: [{ icon: "🐳", name: "Whale" }, { icon: "🫐", name: "Berry" }] },
    { name: "Green", hex: "#3CB371", emoji: "🟢", items: [{ icon: "🥦", name: "Broccoli" }, { icon: "🐸", name: "Frog" }] },
    { name: "Yellow", hex: "#FFD700", emoji: "🟡", items: [{ icon: "🍌", name: "Banana" }, { icon: "☀️", name: "Sun" }] },
    { name: "Purple", hex: "#A64DFF", emoji: "🟣", items: [{ icon: "🍆", name: "Eggplant" }, { icon: "☂️", name: "Umbrella" }] },
    { name: "Orange", hex: "#FFA500", emoji: "🟠", items: [{ icon: "🍊", name: "Orange" }, { icon: "🦊", name: "Fox" }] },
  ];

  const current = colors[index];

  useEffect(() => {
    bgAnim.setValue(0);
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", current.hex + "33"],
  });

  useEffect(() => {
    floatAnim.setValue(0);
    emojiAnim.setValue(0);

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -15,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(emojiAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(emojiAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [index]);

  const speak = () => {
    if (speaking) return;

    setSpeaking(true);
    Speech.stop();

    Speech.speak(`This is ${current.name} color`, {
      onDone: () => setSpeaking(false),
    });

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
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
  }, [index]);

  const openPopup = () => {
    Speech.stop();
    setSpeaking(false);
    setShowPopup(true);
  };

  const next = () => {
    if (speaking) return;
    if (index < colors.length - 1) setIndex(index + 1);
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

  const exitToMenu = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/five");
  };

  const Popup = () => (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
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

  const AnimatedEmoji = () => (
    <Animated.Text
      style={[
        styles.emoji,
        {
          transform: [
            { translateY: floatAnim },
            {
              scale: emojiAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        },
      ]}
    >
      {current.emoji}
    </Animated.Text>
  );

  const GameUI = () => (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={openPopup}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <View style={styles.titleRow}>
        {"LEARN COLORS".split("").map((c, i) => (
          <Text key={i} style={[styles.titleChar, { color: `hsl(${i * 22},80%,45%)` }]}>
            {c}
          </Text>
        ))}
      </View>

      <AnimatedEmoji />

      <Text style={styles.nameBig}>{current.name}</Text>

      <View style={styles.itemsRow}>
        {current.items.map((item, i) => (
          <View key={i} style={[styles.itemCard, { backgroundColor: current.hex + "33" }]}>
            <Text style={styles.itemEmoji}>{item.icon}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
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
    <Animated.View style={[styles.rewardContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.backBtn} onPress={openPopup}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup />}

      <Animated.Text style={{ fontSize: 120 }}>🏆</Animated.Text>

      <Text style={styles.rewardText}>Great Job!</Text>

      <TouchableOpacity style={styles.restartBtn} onPress={restart}>
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return showReward ? <RewardUI /> : <GameUI />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  titleRow: { flexDirection: "row", position: "absolute", top: 60 },
  titleChar: { fontSize: 26, fontWeight: "bold" },

  emoji: { fontSize: 110 },

  nameBig: { fontSize: 34, fontWeight: "bold", marginTop: 10, color: "#ff4081" },

  itemsRow: { flexDirection: "row", marginTop: 30, gap: 20 },

  itemCard: { padding: 20, borderRadius: 18, alignItems: "center" },

  itemEmoji: { fontSize: 60 },

  itemName: { fontSize: 14, marginTop: 6, fontWeight: "600" },

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
    zIndex: 20,
  },

  rewardContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  rewardText: { fontSize: 30, fontWeight: "bold" },

  restartBtn: {
    marginTop: 20,
    backgroundColor: "#FF6F00",
    padding: 12,
    borderRadius: 10,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },

  popup: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
    elevation: 20,
  },

  popBtn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});