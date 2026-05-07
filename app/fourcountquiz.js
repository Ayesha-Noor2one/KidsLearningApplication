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
import { FontAwesome5 } from "@expo/vector-icons";

const ITEMS = ["🍎", "🐶", "🚗", "⚽", "🌸", "⭐", "🦋", "🎈"];

const diceIcons = [
  "dice-one",
  "dice-two",
  "dice-three",
  "dice-four",
  "dice-five",
  "dice-six",
];

export default function CountingCollectGame() {
  const router = useRouter();

  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState(1);
  const [items, setItems] = useState([]);
  const [collected, setCollected] = useState([]);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [diceValue, setDiceValue] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const thumbAnim = useRef(new Animated.Value(1)).current;
  const thumbRotate = useRef(new Animated.Value(0)).current;

  const fingerAnim = useRef(new Animated.Value(0)).current;

  
  const flowerAnim = useRef(new Animated.Value(1)).current;

 
  useEffect(() => {
    generateLevel();

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
        Animated.timing(fingerAnim, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fingerAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(thumbRotate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [level]);

 
  useEffect(() => {
    if (showResult) {
      flowerAnim.setValue(1);

      Animated.loop(
        Animated.sequence([
          Animated.timing(flowerAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(flowerAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showResult]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF3C7", "#E8F9FF"],
  });

  const rotateThumb = thumbRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const generateLevel = () => {
    if (level > 10) {
      setShowResult(true);
      return;
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    setTarget(dice);
    setDiceValue(dice);

    const newItems = Array.from({ length: 12 }, () =>
      ITEMS[Math.floor(Math.random() * ITEMS.length)]
    );

    setItems(newItems);
    setCollected([]);
  };

  const selectItem = (item) => {
    setCollected((prev) => [...prev, item]);
  };

  const checkAnswer = () => {
    if (collected.length === target) {
      setRight((r) => r + 1);
      Speech.speak("Great job!");
      setTimeout(() => setLevel((l) => l + 1), 800);
    } else {
      setWrong((w) => w + 1);

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      Speech.speak("Try again!");
      setCollected([]);
    }
  };

  const rollDice = () => {
    let i = 0;

    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      i++;

      if (i > 10) {
        clearInterval(interval);
        const final = Math.floor(Math.random() * 6) + 1;
        setDiceValue(final);
        setTarget(final);

        setTimeout(() => {
          Speech.speak(`Collect ${final} items`);
        }, 300);
      }
    }, 70);
  };

  const thumbPress = () => {
    Animated.sequence([
      Animated.spring(thumbAnim, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(thumbAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    checkAnswer();
  };

  function Popup() {
    return (
      <Modal transparent visible={showPopup}>
        <View style={styles.popup}>
          <View style={styles.popupBox}>
            <Text style={{ fontSize: 18 }}>Exit Game?</Text>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "red" }]}
                onPress={() => setShowPopup(false)}
              >
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

 
  if (showResult) {
    return (
      <View style={styles.resultContainer}>

       
        <TouchableOpacity style={styles.back} onPress={() => setShowPopup(true)}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

      
        <Text style={styles.title}>🎉 GOOD JOB 🎉</Text>

       
        <Animated.Text
          style={[
            styles.flower,
            { transform: [{ scale: flowerAnim }] }
          ]}
        >
         🌻
        </Animated.Text>

     
        <Text style={styles.score}>✔ {right} ❌ {wrong}</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setLevel(1);
            setRight(0);
            setWrong(0);
            setShowResult(false);
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
      <StatusBar />

      <TouchableOpacity style={styles.back} onPress={() => setShowPopup(true)}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🎲 COUNT & COLLECT</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          {items.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => selectItem(item)}>
              <View style={styles.box}>
                <Text style={styles.emoji}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.diceRow}>
        <Animated.View style={{ transform: [{ translateX: fingerAnim }] }}>
          <Text style={{ fontSize: 35 }}>👉</Text>
        </Animated.View>

        <TouchableOpacity onPress={rollDice}>
          <View style={styles.dice}>
            <FontAwesome5
              name={diceIcons[diceValue - 1]}
              size={55}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.collectBox,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <View style={styles.collectInner}>
          {collected.map((c, i) => (
            <Text key={i} style={styles.collectEmoji}>{c}</Text>
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: thumbAnim }, { rotate: rotateThumb }] }}>
          <TouchableOpacity onPress={thumbPress}>
            <Text style={styles.thumb}>👍</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <View style={styles.scoreRow}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
        <Text>Level {level}</Text>
      </View>

      <Popup />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },

  title: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C5CE7",
  },

  card: {
    width: "92%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  box: {
    width: 70,
    height: 70,
    margin: 6,
    backgroundColor: "#E8F9FF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: { fontSize: 30 },


  diceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 18,
    justifyContent: "center",
  },

  dice: {
    width: 90,
    height: 90,
    backgroundColor: "#eb0606ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  collectBox: {
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 50,
    marginTop: 25,
    alignItems: "center",
  },

  collectInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },

  collectEmoji: { fontSize: 26, margin: 2 },

  thumb: { fontSize: 55 }, 

  scoreRow: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    gap: 20,
  },

  
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },

  flower: {
    fontSize: 140,  
    marginVertical: 25,
  },

  score: {
    fontSize: 22,
    marginVertical: 15,
    fontWeight: "600",
  },

  playBtn: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 14,
    marginTop: 20,
    elevation: 5,
  },

  back: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 30,
    elevation: 4,
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
});