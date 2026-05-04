import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Match Quiz";
// ---------------- LEVEL BUILDER ----------------
const buildLevel = (emojis) => {
  let items = [];
  emojis.forEach((e, i) => {
    items.push(
      { id: `${e}-1-${i}`, emoji: e, match: e },
      { id: `${e}-2-${i}`, emoji: e, match: e }
    );
  });
  return items.sort(() => Math.random() - 0.5);
};

const LEVELS = Array.from({ length: 10 }, (_, i) =>
  buildLevel(
    i < 3
      ? ["🐶", "🐱", "🐭", "🐹"]
      : i < 7
      ? ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒"]
      : ["⚽", "🏀", "🚗", "🚀", "✈️", "🎾"]
  )
);

// ---------------- CARD COMPONENT ----------------
const CardItem = ({ item, isSelected, isMatched, onPress }) => {
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMatched) {
      flip.setValue(0);
      Animated.timing(flip, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isMatched]);

  const rotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotateY }] }}>
      <TouchableOpacity
        disabled={isMatched}
        style={[
          styles.card,
          {
            backgroundColor: isMatched
              ? "#CFFFD0"
              : isSelected
              ? "#FFE08A"
              : "#fff",
          },
        ]}
        onPress={onPress}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ---------------- MAIN GAME ----------------
export default function KidsGame() {
  const router = useRouter();

  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(0);
const [right, setRight] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const level = LEVELS[levelIndex];

  // ---------------- SHAKE ----------------
  const shake = useRef(new Animated.Value(0)).current;

  const runShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // ---------------- SUN ----------------
  const sun = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(sun, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const sunRotate = sun.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // ---------------- STAR ----------------
  const star = useRef(new Animated.Value(0)).current;
  const [showStar, setShowStar] = useState(false);

  const playStar = () => {
    setShowStar(true);
    star.setValue(0);

    Animated.sequence([
      Animated.spring(star, { toValue: 1, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(star, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowStar(false);
      nextLevel();
    });

    Speech.speak("Good job!");
  };

  const starScale = star.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.5],
  });

  const starRotate = star.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // ---------------- HANDLE ----------------
  const handlePress = (item) => {
    if (selected.length === 2) return;

    const newSel = [...selected, item];
    setSelected(newSel);

    if (newSel.length === 2) {
      const [a, b] = newSel;

      setTimeout(() => {
        if (a.match === b.match) {
          const newMatched = [...matched, a.id, b.id];
          setMatched(newMatched);
setRight((r) => r + 1);
          if (newMatched.length === level.length) {
            setCompleted((c) => c + 1);
            playStar();
          }
        } else {
          setWrong((w) => w + 1);
          runShake();
        }

        setSelected([]);
      }, 300);
    }
  };

  // ---------------- NEXT LEVEL ----------------
  const nextLevel = () => {
    if (levelIndex === 9) {
      saveProgress();
      setShowReward(true);
      return;
    }

    setMatched([]);
    setSelected([]);
    setLevelIndex((l) => l + 1);
  };

  // ---------------- EXIT ----------------
  const exitNow = () => {
    setShowExit(false);
    router.push("three");
  };

  // ---------------- REWARD ----------------
  const rewardRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rewardRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rewardSpin = rewardRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (showReward) {
    return (
      <View style={[styles.container, { backgroundColor: "#FFF0F6" }]}>

        {/* BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
          <View style={styles.backCircle}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* STAR */}
        <Animated.Text style={[styles.rewardStar, { transform: [{ rotate: rewardSpin }] }]}>
          ⭐
        </Animated.Text>

        <Text style={{ marginTop: 20, fontSize: 18 }}>
          Wrong Attempts: {wrong}
        </Text>

        <Text style={{ marginTop: 20, fontSize: 18 }}>
  Right Attempts: {right} {/* ✅ ADD */}
</Text>

        {/* REPLAY */}
        <TouchableOpacity style={styles.replayBtn} onPress={() => {
          setLevelIndex(0);
          setMatched([]);
          setSelected([]);
          setCompleted(0);
          setWrong(0);
          setRight(0); // ✅ ADD
          setShowReward(false);
        }}>
          <Text style={{ color: "#fff", fontSize: 18 }}>
            🔁 Play Again
          </Text>
        </TouchableOpacity>

        {/* EXIT MODAL */}
        <Modal transparent visible={showExit}>
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text>Exit Game?</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity style={styles.yesBtn} onPress={exitNow}>
                  <Text style={{ color: "#fff" }}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.noBtn} onPress={() => setShowExit(false)}>
                  <Text style={{ color: "#fff" }}>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      
      await addQuizResult(kidId, quiz, right,wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };
  return (
    <View style={styles.container}>

      {/* BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <View style={styles.backCircle}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>Match the Pairs 🎯</Text>

      {/* SUN */}
      <Animated.Text style={[styles.sun, { transform: [{ rotate: sunRotate }] }]}>
        ☀️
      </Animated.Text>

      {/* GRID */}
      <Animated.View style={[styles.grid, { transform: [{ translateX: shake }] }]}>
        {level.map((item) => {
          const isSelected = selected.find((i) => i.id === item.id);
          const isMatched = matched.includes(item.id);

          return (
            <CardItem
              key={item.id}
              item={item}
              isSelected={isSelected}
              isMatched={isMatched}
              onPress={() => handlePress(item)}
            />
          );
        })}
      </Animated.View>

      {/* STAR */}
      {showStar && (
        <Animated.Text
          style={[
            styles.star,
            {
              transform: [{ scale: starScale }, { rotate: starRotate }],
            },
          ]}
        >
          ⭐
        </Animated.Text>
      )}

      {/* HUD */}
      <View style={styles.hud}>
        <Text style={{ color: "#6C5CE7" }}>Level {levelIndex + 1}</Text>
        <Text style={{ color: "green" }}>Right {right}</Text>
        <Text style={{ color: "red" }}>Wrong {wrong}</Text>
        <Text style={{ color: "green" }}>Done {completed}</Text>
      </View>

      {/* EXIT MODAL */}
      <Modal transparent visible={showExit}>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text>Exit Game?</Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity style={styles.yesBtn} onPress={exitNow}>
                <Text style={{ color: "#fff" }}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noBtn} onPress={() => setShowExit(false)}>
                <Text style={{ color: "#fff" }}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    position: "absolute",
    top: 60,
    fontSize: 22,
    fontWeight: "bold",
  },

  sun: {
    position: "absolute",
    top: 60,
    right: 20,
    fontSize: 60,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    width: 85,
    height: 85,
    margin: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  emoji: {
    fontSize: 38,
  },

  hud: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    gap: 20,
  },

  star: {
    position: "absolute",
    fontSize: 100,
    top: "40%",
  },

  rewardStar: {
    fontSize: 130,
    color: "#FF69B4",
  },

  replayBtn: {
    marginTop: 30,
    backgroundColor: "#6C5CE7",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  backCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: 260,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },

  yesBtn: {
    backgroundColor: "green",
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },

  noBtn: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },
});