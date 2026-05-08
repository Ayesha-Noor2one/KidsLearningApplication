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
    { letter: "A", items: [{ word: "APPLE", emoji: "🍎" }, { word: "ANT", emoji: "🐜" }] },
    { letter: "B", items: [{ word: "BALL", emoji: "⚽" }, { word: "BEE", emoji: "🐝" }] },
    { letter: "C", items: [{ word: "CAT", emoji: "🐱" }, { word: "CAR", emoji: "🚗" }] },
    { letter: "D", items: [{ word: "DOG", emoji: "🐶" }, { word: "DUCK", emoji: "🦆" }] },
    { letter: "E", items: [{ word: "EGG", emoji: "🥚" }, { word: "ELEPHANT", emoji: "🐘" }] },
    { letter: "F", items: [{ word: "FISH", emoji: "🐟" }, { word: "FROG", emoji: "🐸" }] },
    { letter: "G", items: [{ word: "GRAPES", emoji: "🍇" }, { word: "GOAT", emoji: "🐐" }] },
    { letter: "H", items: [{ word: "HAT", emoji: "🎩" }, { word: "HORSE", emoji: "🐴" }] },
    { letter: "I", items: [{ word: "ICE", emoji: "🧊" }, { word: "IGLOO", emoji: "🏠" }] },
    { letter: "J", items: [{ word: "JUICE", emoji: "🧃" }, { word: "JET", emoji: "✈️" }] },
    { letter: "K", items: [{ word: "KITE", emoji: "🪁" }, { word: "KEY", emoji: "🔑" }] },
    { letter: "L", items: [{ word: "LION", emoji: "🦁" }, { word: "LEAF", emoji: "🍃" }] },
    { letter: "M", items: [{ word: "MANGO", emoji: "🥭" }, { word: "MOON", emoji: "🌙" }] },
    { letter: "N", items: [{ word: "NEST", emoji: "🪺" }, { word: "NOSE", emoji: "👃" }] },
    { letter: "O", items: [{ word: "ORANGE", emoji: "🍊" }, { word: "OWL", emoji: "🦉" }] },
    { letter: "P", items: [{ word: "PEN", emoji: "🖊️" }, { word: "PIG", emoji: "🐷" }] },
    { letter: "Q", items: [{ word: "QUEEN", emoji: "👑" }, { word: "QUILT", emoji: "🛏️" }] },
    { letter: "R", items: [{ word: "RABBIT", emoji: "🐰" }, { word: "RAIN", emoji: "🌧️" }] },
    { letter: "S", items: [{ word: "SUN", emoji: "☀️" }, { word: "STAR", emoji: "⭐" }] },
    { letter: "T", items: [{ word: "TREE", emoji: "🌳" }, { word: "TRAIN", emoji: "🚂" }] },
    { letter: "U", items: [{ word: "UMBRELLA", emoji: "☂️" }, { word: "UNICORN", emoji: "🦄" }] },
    { letter: "V", items: [{ word: "VAN", emoji: "🚐" }, { word: "VIOLIN", emoji: "🎻" }] },
    { letter: "W", items: [{ word: "WATERMELON", emoji: "🍉" }, { word: "WATCH", emoji: "⌚" }] },
    { letter: "X", items: [{ word: "XYLOPHONE", emoji: "🎼" }, { word: "X-RAY", emoji: "🩻" }] },
    { letter: "Y", items: [{ word: "YACHT", emoji: "🛥️" }, { word: "YOYO", emoji: "🪀" }] },
    { letter: "Z", items: [{ word: "ZEBRA", emoji: "🦓" }, { word: "ZIP", emoji: "🤐" }] },
  ];

  const current = alphabets[index];

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

  const speakAlphabet = () => {
    if (lock.current) return;

    lock.current = true;
    setCanTapSpell(false);
    Speech.stop();

    Speech.speak(`${current.letter}`, {
      onDone: () => {
        Speech.speak(
          `${current.letter} for ${current.items[0].word}. ${current.letter} for ${current.items[1].word}`,
          {
            onDone: () => {
              lock.current = false;
              setCanTapSpell(true);
            },
          }
        );
      },
    });
  };

  useEffect(() => {
    speakAlphabet();
  }, [index]);

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
    lock.current = false;
    setShowPopup(false);
    router.push("/three");
  };

  if (finished) {
    return (
      <View style={styles.rewardContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          Speech.stop();
          setShowPopup(true);
        }}>
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

      <TouchableOpacity style={styles.backBtn} onPress={() => {
        Speech.stop();
        setShowPopup(true);
      }}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {showPopup && <Popup onClose={() => setShowPopup(false)} onYes={exitToMenu} />}

      <Text style={styles.name}>{current.letter}</Text>

      <View style={styles.itemsRow}>
        {current.items.map((item, i) => (
          <Animated.View
            key={i}
            style={[
              styles.itemBox,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.word}>{item.word}</Text>
          </Animated.View>
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
  title: { fontSize: 26, fontWeight: "bold", position: "absolute", top: 60,color:"#350ff370" },
  name: { fontSize: 150, fontWeight: "bold", marginBottom: 20,top:-15 },

  itemsRow: { flexDirection: "row", gap: 20 },

  itemBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20
  },

  emoji: { fontSize: 80 },
  word: { fontSize: 30, fontWeight: "bold",color:"#e20d0d70", marginTop: 10 },

  nav: { flexDirection: "row", position: "absolute", bottom: 60, gap: 40 },
  navBtn: { backgroundColor: "#00000055", padding: 12, borderRadius: 30 },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#e2232370",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },

  popupOverlay: {
    position: "absolute",
    top: 0,left: 0,right: 0,bottom: 0,
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