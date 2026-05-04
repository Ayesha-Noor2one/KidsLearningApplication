import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

/* 🏠 EXPANDED DAILY OBJECTS */
const objects = [
  { emoji: "🪑", name: "CHAIR" },
  { emoji: "🛏️", name: "BED" },
  { emoji: "🪟", name: "WINDOW" },
  { emoji: "🚪", name: "DOOR" },
  { emoji: "📖", name: "BOOK" },
  { emoji: "✏️", name: "PENCIL" },
  { emoji: "🖊️", name: "PEN" },
  { emoji: "🎒", name: "BAG" },
  { emoji: "🥛", name: "GLASS" },
  { emoji: "🍽️", name: "PLATE" },
  { emoji: "🥄", name: "SPOON" },
  { emoji: "🍴", name: "FORK" },

  /* 🆕 ADDED DAILY OBJECTS */
  { emoji: "🧼", name: "SOAP" },
  { emoji: "🚿", name: "SHOWER" },
  { emoji: "🪥", name: "BRUSH" },
  { emoji: "🧴", name: "LOTION" },
  { emoji: "🧻", name: "TISSUE" },
  { emoji: "🧽", name: "SPONGE" },
  { emoji: "🧹", name: "BROOM" },
  { emoji: "🪣", name: "BUCKET" },
  { emoji: "🛒", name: "CART" },
  { emoji: "🧺", name: "BASKET" },
  { emoji: "🔑", name: "KEY" },
  { emoji: "💡", name: "LIGHT" },
];

export default function ObjectsLearningScreen() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);
  const [canTapSpell, setCanTapSpell] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const lock = useRef(false);

  const current = objects[index];
  const letters = current.name.split("");

  /* 🌈 BACKGROUND ANIMATION */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 2, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#D7F9FF", "#FFF3C7", "#E5FFE5"],
  });

  /* 🎈 FLOAT */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
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
  }, []);

  /* 🔊 SPEECH LOCK SYSTEM */
  const speakObject = () => {
    if (lock.current) return;

    lock.current = true;
    setCanTapSpell(false);

    Speech.stop();
    Speech.speak(current.name, { rate: 0.9, pitch: 1.2 });

    let delay = 900;

    letters.forEach((l) => {
      setTimeout(() => {
        Speech.speak(l, { rate: 0.85, pitch: 1.4 });
      }, delay);
      delay += 450;
    });

    setTimeout(() => {
      lock.current = false;
      setCanTapSpell(true);
    }, delay);
  };

  useEffect(() => {
    speakObject();
  }, [index]);

  /* 🔤 LETTER SPEAK */
  const speakLetter = (l) => {
    if (!canTapSpell) return;
    Speech.stop();
    Speech.speak(l, { rate: 0.9, pitch: 1.5 });
  };

  /* ⏭ NAV */
  const next = () => {
    if (lock.current) return;

    if (index === objects.length - 1) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (lock.current) return;
    if (index > 0) setIndex(index - 1);
  };

  /* ❌ EXIT */
  const exitGame = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/three");
  };

  /* 🎉 FINISH SCREEN */
  if (finished) {
    return (
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardTitle}>🌟 Amazing!</Text>
        <Text style={styles.rewardSub}>You learned daily objects 🎉</Text>
        <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            setIndex(0);
            setFinished(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Daily Objects Learning</Text>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Exit Game?</Text>

            <View style={styles.popupRow}>
              <TouchableOpacity
                style={[styles.popBtn, { backgroundColor: "red" }]}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.popText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popBtn, { backgroundColor: "green" }]}
                onPress={exitGame}
              >
                <Text style={styles.popText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* OBJECT */}
      <Animated.Text
        style={[
          styles.emoji,
          { transform: [{ translateY: floatAnim }] },
        ]}
        onPress={speakObject}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.name}>{current.name}</Text>

      {/* SPELLING */}
      <View style={styles.letters}>
        {letters.map((l, i) => (
          <TouchableOpacity
            key={i}
            disabled={!canTapSpell}
            onPress={() => speakLetter(l)}
            style={[styles.letterBox, { backgroundColor: `hsl(${i * 40}, 80%, 85%)` }]}
          >
            <Text style={styles.letter}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NAV */}
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

/* STYLES SAME AS YOUR ORIGINAL */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  title: { fontSize: 24, fontWeight: "bold", position: "absolute", top: 60 },

  emoji: { fontSize: 120 },

  name: { fontSize: 28, fontWeight: "bold", marginTop: 10 },

  letters: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },

  letterBox: { margin: 5, padding: 12, borderRadius: 15 },

  letter: { fontSize: 22, fontWeight: "bold" },

  nav: { flexDirection: "row", position: "absolute", bottom: 60, gap: 40 },

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
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  popupTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  popupRow: { flexDirection: "row", gap: 15 },

  popBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  popText: { color: "#fff", fontWeight: "bold" },

  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },

  rewardTitle: { fontSize: 30, fontWeight: "bold" },

  rewardSub: { marginTop: 10, fontSize: 18 },

  stars: { fontSize: 40, marginTop: 20 },

  restartBtn: {
    marginTop: 30,
    backgroundColor: "#ff69b4",
    padding: 12,
    borderRadius: 20,
  },
});