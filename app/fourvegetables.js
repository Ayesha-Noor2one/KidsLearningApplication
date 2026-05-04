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

export default function VegetableLearningScreen() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);
  const [canTapSpell, setCanTapSpell] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const lock = useRef(false);

  const vegetables = [
    { name: "CARROT", emoji: "🥕" },
    { name: "TOMATO", emoji: "🍅" },
    { name: "POTATO", emoji: "🥔" },
    { name: "ONION", emoji: "🧅" },
    { name: "BROCCOLI", emoji: "🥦" },
    { name: "CORN", emoji: "🌽" },
    { name: "CUCUMBER", emoji: "🥒" },
    { name: "CHILLI", emoji: "🌶️" },
    { name: "GARLIC", emoji: "🧄" },
    { name: "LETTUCE", emoji: "🥬" },
  ];

  const current = vegetables[index] || vegetables[0];

  const [letterAnims, setLetterAnims] = useState([]);

  useEffect(() => {
    const anims = (current?.name || "").split("").map(() => new Animated.Value(1));
    setLetterAnims(anims);
  }, [index]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#E6FFF2", "#FFF5E6", "#E6F0FF"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 2, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const colors = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9D4EDD"];

  const bounceLetter = (i) => {
    if (!letterAnims[i]) return;

    Animated.sequence([
      Animated.timing(letterAnims[i], {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnims[i], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔊 SPEAK FULL WORD → ONLY THEN ENABLE TAP
  const speakVegetable = () => {
    if (lock.current || !current) return;

    lock.current = true;
    setCanTapSpell(false);
    Speech.stop();

    const word = current.name;
    Speech.speak(word);

    let delay = 900;

    word.split("").forEach((l, i) => {
      setTimeout(() => {
        bounceLetter(i);
        Speech.speak(l);
      }, delay);

      delay += 350;
    });

    // ✅ ONLY AFTER FULL SPEECH END → ENABLE TAP
    setTimeout(() => {
      lock.current = false;
      setCanTapSpell(true);
    }, delay + 300);
  };

  useEffect(() => {
    speakVegetable();
  }, [index]);

  const speakLetter = (l, i) => {
    if (!canTapSpell) return; // 🔒 BLOCK UNTIL SPEECH FINISH
    bounceLetter(i);
    Speech.stop();
    Speech.speak(l);
  };

  const next = () => {
    if (lock.current) return;

    if (index >= vegetables.length - 1) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (lock.current) return;
    if (index > 0) setIndex(index - 1);
  };

  const exitToMenu = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/four");
  };

  // ---------------- EXIT POPUP (FIXED OVERLAP) ----------------
  const Popup = () => (
    <Modal transparent visible={showPopup} animationType="fade">
      <View style={styles.popupOverlay}>
        <View style={styles.popupBox}>
          <Text style={styles.popupTitle}>Exit Game?</Text>

          <View style={styles.popupRow}>
            <TouchableOpacity style={[styles.popBtn, styles.noBtn]} onPress={() => setShowPopup(false)}>
              <Text style={styles.popText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.popBtn, styles.yesBtn]} onPress={exitToMenu}>
              <Text style={styles.popText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ---------------- REWARD ----------------
  if (finished) {
    return (
      <View style={styles.rewardContainer}>

        {/* BACK BUTTON RESTORED */}
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.rewardTitle}>🥕 Amazing!</Text>
        <Text style={styles.rewardSub}>You learned vegetables 🎉</Text>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            setIndex(0);
            setFinished(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

        <Popup />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Learn Vegetables 🥦</Text>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Popup />

      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: floatAnim }] }]}
        onPress={speakVegetable}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.name}>{current.name}</Text>

      {/* COLORFUL SPELLING */}
      <View style={styles.letters}>
        {(current?.name || "").split("").map((l, i) => (
          <TouchableOpacity key={i} disabled={!canTapSpell} onPress={() => speakLetter(l, i)}>
            <Animated.View
              style={[
                styles.letterBox,
                {
                  transform: [{ scale: letterAnims[i] || new Animated.Value(1) }],
                  backgroundColor: colors[i % colors.length],
                },
              ]}
            >
              <Text style={styles.letter}>{l}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={prev}>
          <FontAwesome name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={next}>
          <FontAwesome name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: "bold",
    position: "absolute",
    top: 60,
  },

  emoji: {
    fontSize: 120,
  },

  name: {
    fontSize: 45,
    fontWeight: "bold",
    marginTop: 10,
  },

  letters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },

  letterBox: {
    margin: 5,
    padding: 12,
    borderRadius: 15,
    minWidth: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  letter: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  nav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
    gap: 40,
  },

  navBtn: {
    backgroundColor: "#00000055",
    padding: 12,
    borderRadius: 30,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#00000070",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },

  // ---------------- POPUP ----------------
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popupBox: {
    width: "80%",
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

  popupRow: {
    flexDirection: "row",
    gap: 15,
  },

  popBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  noBtn: {
    backgroundColor: "#FF4D4D",
  },

  yesBtn: {
    backgroundColor: "#2ECC71",
  },

  popText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // ---------------- REWARD ----------------
  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FFF0",
  },

  rewardTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },

  rewardSub: {
    marginTop: 10,
    fontSize: 18,
  },

  restartBtn: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
});