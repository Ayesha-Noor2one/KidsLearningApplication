import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  StatusBar,
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const LEVELS = [
  { items: ["🍎", "🍎", "🍇", "🍎"], odd: "🍇", msg: "Find the odd fruit" },
  { items: ["🐶", "🐱", "🐶", "🐶"], odd: "🐱", msg: "Find the odd animal" },
  { items: ["🚗", "🚗", "✈️", "🚗"], odd: "✈️", msg: "Find the odd vehicle" },
  { items: ["🏀", "⚽", "⚽", "⚽"], odd: "🏀", msg: "Find the odd ball" },
  { items: ["🌞", "🌞", "🌙", "🌞"], odd: "🌙", msg: "Find the odd sky item" },
  { items: ["🐝", "🐝", "🐝", "🦋"], odd: "🦋", msg: "Find the odd insect" },
  { items: ["🍔", "🍕", "🍔", "🍔"], odd: "🍕", msg: "Find the odd food" },
  { items: ["🚀", "🚀", "🛸", "🚀"], odd: "🛸", msg: "Find the odd space item" },
  { items: ["🐸", "🐸", "🐼", "🐸"], odd: "🐼", msg: "Find the odd animal" },
  { items: ["🎸", "🎵", "🎵", "🎵"], odd: "🎸", msg: "Find the odd music item" },
  { items: ["🚌", "🚕", "🚌", "🚌"], odd: "🚕", msg: "Find the odd transport" },
  { items: ["🌸", "🌻", "🌸", "🌸"], odd: "🌻", msg: "Find the odd flower" },
  { items: ["🍌", "🍎", "🍌", "🍌"], odd: "🍎", msg: "Find the odd fruit" },
  ];

export default function OddOneOutGame() {
  const router = useRouter();

  const [level, setLevel] = useState(0);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;

  const current = LEVELS[level];

  useEffect(() => {
    Speech.stop();
    Speech.speak(current.msg);

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(cardAnim, { toValue: 1.08, useNativeDriver: true }),
        Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  }, [level]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF3C7", "#E8F9FF"],
  });

  const pop = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.25, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const onPress = (item) => {
    if (item === current.odd) {
      Speech.speak("Great job!");
      setRight((r) => r + 1);
      pop();

      setTimeout(() => {
        if (level + 1 < LEVELS.length) {
          setLevel((l) => l + 1);
        } else {
          setShowResult(true);

          Animated.loop(
            Animated.sequence([
              Animated.spring(flowerAnim, { toValue: 1.3, useNativeDriver: true }),
              Animated.spring(flowerAnim, { toValue: 1, useNativeDriver: true }),
            ])
          ).start();
        }
      }, 600);
    } else {
      Speech.speak("Try again");
      setWrong((w) => w + 1);
      shake();
    }
  };

  const restart = () => {
    setLevel(0);
    setRight(0);
    setWrong(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <View style={[styles.container, { backgroundColor: "#FFF7E0" }]}>
        <TouchableOpacity style={styles.back} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.rewardTitle}>🎉 AMAZING 🎉</Text>

        <Animated.Text
          style={{ fontSize: 140, transform: [{ scale: flowerAnim }] }}
        >
          🌷
        </Animated.Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>✔ {right}</Text>
          <Text style={styles.scoreText}>❌ {wrong}</Text>
        </View>

        <TouchableOpacity style={styles.playBtn} onPress={restart}>
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

        <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar />

      <TouchableOpacity style={styles.back} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🌈 ODD ONE OUT 🌈</Text>
      <Text style={styles.hint}>{current.msg}</Text>

      {/* BIG CARD */}
      <Animated.View
        style={[
          styles.bigCard,
          {
            transform: [
              { translateX: shakeAnim },
              { scale: scaleAnim },
              { scale: cardAnim },
            ],
          },
        ]}
      >
        <View style={styles.row}>
          {current.items.map((item, i) => (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: cardAnim }] }}
            >
              <TouchableOpacity style={styles.box} onPress={() => onPress(item)}>
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
        <Text>Level {level + 1}</Text>
      </View>

      <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
    </Animated.View>
  );
}

function Popup({ show, close, router }) {
  return (
    <Modal transparent visible={show}>
      <View style={styles.popup}>
        <View style={styles.popupBox}>
          <Text style={{ fontSize: 18 }}>Exit Game?</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={close}>
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "green" }]}
              onPress={() => router.push("/five")}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  back: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 25,
  },

  title: {
    position: "absolute",
    top: 70,
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B6B",
  },

  hint: {
    fontSize: 30,
    marginBottom:80,
    color: "#bd5ff7ff"
  },

  bigCard: {
    backgroundColor: "#fff",
    padding: 50,
    borderRadius: 20,
    borderheight:40,
    elevation: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  box: {
    width: 100,
    height: 100,
    backgroundColor: "#ecf3c5ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  emoji: {
    fontSize: 45,
  },

  score: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    gap: 20,
  },

  popup: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },

  btn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  rewardTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 20,
  },

  scoreRow: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },

  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  playBtn: {
    backgroundColor: "#6C5CE7",
    padding: 14,
    borderRadius: 12,
    marginTop: 25,
  },
});