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

export default function AlphabetLearningScreen() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);
  const [canTapSpell, setCanTapSpell] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const lock = useRef(false);

  const alphabets = [
    { letter: "A", word: "APPLE", emoji: "🍎" },
    { letter: "B", word: "BALL", emoji: "⚽" },
    { letter: "C", word: "CAT", emoji: "🐱" },
    { letter: "D", word: "DOG", emoji: "🐶" },
    { letter: "E", word: "EGG", emoji: "🥚" },
    { letter: "F", word: "FISH", emoji: "🐟" },
    { letter: "G", word: "GRAPES", emoji: "🍇" },
    { letter: "H", word: "HAT", emoji: "🎩" },
    { letter: "I", word: "ICE", emoji: "🧊" },
    { letter: "J", word: "JUICE", emoji: "🧃" },
    { letter: "K", word: "KITE", emoji: "🪁" },
    { letter: "L", word: "LION", emoji: "🦁" },
    { letter: "M", word: "MANGO", emoji: "🥭" },
    { letter: "N", word: "NEST", emoji: "🪺" },
    { letter: "O", word: "ORANGE", emoji: "🍊" },
    { letter: "P", word: "PEN", emoji: "🖊️" },
    { letter: "Q", word: "QUEEN", emoji: "👑" },
    { letter: "R", word: "RABBIT", emoji: "🐰" },
    { letter: "S", word: "SUN", emoji: "☀️" },
    { letter: "T", word: "TREE", emoji: "🌳" },
    { letter: "U", word: "UMBRELLA", emoji: "☂️" },
    { letter: "V", word: "VAN", emoji: "🚐" },
    { letter: "W", word: "WATERMELON", emoji: "🍉" },
    { letter: "X", word: "XYLOPHONE", emoji: "🎼" },
    { letter: "Y", word: "YACHT", emoji: "🛥️" },
    { letter: "Z", word: "ZEBRA", emoji: "🦓" },
  ];

  const current = alphabets[index];

  const letterAnims = useRef(
    current.word.split("").map(() => new Animated.Value(1))
  ).current;

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#D7F9FF", "#FFE5E5", "#E5FFE5"],
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

  const bounceLetter = (i) => {
    Animated.sequence([
      Animated.timing(letterAnims[i], {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(letterAnims[i], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const speakAlphabet = () => {
    if (lock.current) return;

    lock.current = true;
    setCanTapSpell(false);
    Speech.stop();

    Speech.speak(current.letter);

    let delay = 800;

    setTimeout(() => {
      Speech.speak(`for ${current.word}`);
    }, delay);

    delay += 800;

    current.word.split("").forEach((l, i) => {
      setTimeout(() => {
        bounceLetter(i);
        Speech.speak(l);
      }, delay);
      delay += 400;
    });

    setTimeout(() => {
      lock.current = false;
      setCanTapSpell(true);
    }, delay);
  };

  useEffect(() => {
    speakAlphabet();
  }, [index]);

  const speakLetter = (l, i) => {
    if (!canTapSpell) return;
    bounceLetter(i);
    Speech.stop();
    Speech.speak(l);
  };

  const next = () => {
    if (lock.current) return;
    if (index === alphabets.length - 1) setFinished(true);
    else setIndex(index + 1);
  };

  const prev = () => {
    if (lock.current) return;
    if (index > 0) setIndex(index - 1);
  };

  const exitToMenu = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/three");
  };

  if (finished) {
    return (
      <View style={styles.rewardContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        {showPopup && <Popup onClose={() => setShowPopup(false)} onYes={exitToMenu} />}

        <Text style={styles.rewardTitle}>🌟 Great Job!</Text>
        <Text style={styles.rewardSub}>You learned alphabets 🎉</Text>

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

      <Text style={styles.title}>Learn Alphabets</Text>

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup onClose={() => setShowPopup(false)} onYes={exitToMenu} />}

      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: floatAnim }] }]}
        onPress={speakAlphabet}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.name}>{current.letter}</Text>

      <View style={styles.letters}>
        {current.word.split("").map((l, i) => (
          <TouchableOpacity key={i} disabled={!canTapSpell} onPress={() => speakLetter(l, i)}>
            <Animated.View
              style={[
                styles.letterBox,
                {
                  transform: [{ scale: letterAnims[i] }],
                  backgroundColor: `hsl(${i * 40},80%,85%)`,
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


const Popup = ({ onClose, onYes }) => (
  <View style={styles.popupOverlay}>
    <View style={styles.popupBox}>
      <Text style={styles.popupTitle}>Exit Game?</Text>

      <View style={styles.popupRow}>
        <TouchableOpacity style={[styles.popBtn, styles.noBtn]} onPress={onClose}>
          <Text style={styles.popText}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.popBtn, styles.yesBtn]} onPress={onYes}>
          <Text style={styles.popText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  title: { fontSize: 26, fontWeight: "bold", position: "absolute", top: 60 },

  emoji: { fontSize: 120 },

  name: { fontSize: 50, fontWeight: "bold", marginTop: 10 },

  letters: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },

  letterBox: { margin: 5, padding: 12, borderRadius: 15 },

  letter: { fontSize: 22, fontWeight: "bold" },

  nav: { flexDirection: "row", position: "absolute", bottom: 60, gap: 40 },

  navBtn: { backgroundColor: "#00000055", padding: 12, borderRadius: 30 },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#00000070",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
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
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },

  popupTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  popupRow: { flexDirection: "row", gap: 15 },

  popBtn: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },

  noBtn: { backgroundColor: "red" },
  yesBtn: { backgroundColor: "green" },

  popText: { color: "#fff", fontWeight: "bold" },

  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },

  rewardTitle: { fontSize: 30, fontWeight: "bold" },

  rewardSub: { marginTop: 10, fontSize: 18 },

  restartBtn: {
    marginTop: 30,
    backgroundColor: "#ff69b4",
    padding: 12,
    borderRadius: 20,
  },
});