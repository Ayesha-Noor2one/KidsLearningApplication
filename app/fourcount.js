import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

function randomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9D4EDD"];

const BalloonSVG = ({ color }) => (
  <Svg height="80" width="60">
    <Circle cx="30" cy="25" r="20" fill={color} />
    <Circle cx="24" cy="20" r="3" fill="#fff" opacity="0.6" />
    <Path d="M30 45 C28 55, 32 65, 30 75" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export default function WindBalloonGame() {
  const navigation = useNavigation();

  const MAX_LEVEL = 8;

  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState(randomNumber());

  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped] = useState([]);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [showExit, setShowExit] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showRoundPopup, setShowRoundPopup] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const isPaused = showIntro || showRoundPopup || showExit;

  const speakTarget = (num) => {
    Speech.stop();
    setTimeout(() => {
      Speech.speak(`Pop the ${num}`);
    }, 250);
  };

  /* BG ANIMATION (RESTORED) */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#EAF7FF", "#FFF3E0"],
  });

  /* HEART ANIMATION */
  useEffect(() => {
    if (gameOver) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [gameOver]);

  const newRound = (t) => {
    const cardWidth = width - 40;
    const cardHeight = 450;

    const positions = Array.from({ length: 10 }, () => ({
      x: Math.random() * (cardWidth - 60),
      y: Math.random() * (cardHeight - 80),
    }));

    const arr = positions.map((pos, i) => ({
      id: i,
      number: i === 0 ? t : randomNumber(),
      x: new Animated.Value(pos.x),
      y: new Animated.Value(pos.y),
    }));

    setTarget(t);
    setBalloons(arr);
    setPopped([]);

    speakTarget(t);
  };

  const startGame = () => {
    const t = randomNumber();
    setTarget(t);
    setShowIntro(false);
    setShowRoundPopup(true);
  };

  const startRound = () => {
    setShowRoundPopup(false);
    newRound(target);
  };

  /* ⚡ SPEED FIX HERE */
  const nextLevel = () => {
    if (level + 1 > MAX_LEVEL) {
      setGameOver(true);
      return;
    }

    const t = randomNumber();
    setLevel((l) => l + 1);
    setTarget(t);
    setShowRoundPopup(true);
  };

  useEffect(() => {
    if (isPaused) return;

    balloons.forEach((b) => {
      const move = () => {
        Animated.sequence([
          Animated.timing(b.x, {
            toValue: Math.random() * (width - 80),
            duration: 5000,
            useNativeDriver: false,
          }),
          Animated.timing(b.y, {
            toValue: Math.random() * 260,
            duration: 5000,
            useNativeDriver: false,
          }),
        ]).start(() => move());
      };
      move();
    });
  }, [balloons, isPaused]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const onPop = (item) => {
    if (popped.includes(item.id)) return;

    if (item.number !== target) {
      setWrong((w) => w + 1);
      shake();
      return;
    }

    setRight((r) => r + 1);
    setPopped((p) => [...p, item.id]);

    /* 🚀 FAST NEXT LEVEL */
    setTimeout(() => nextLevel(), 120);
  };

  const ExitPopup = () =>
    showExit ? (
      <View style={styles.modal}>
        <View style={styles.popup}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Exit Game?
          </Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "green" }]}
              onPress={() => navigation.navigate("four")}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "red" }]}
              onPress={() => setShowExit(false)}
            >
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : null;

  /* 🎉 REWARD SCREEN (UPDATED ONLY UI) */
  if (gameOver) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <ExitPopup />

        <View style={{ alignItems: "center", marginTop: 120 }}>

          <FontAwesome name="trophy" size={60} color="#FFD700" />

          <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 10 }}>
            🎉 Congrats 🎉
          </Text>

          <Animated.Text
            style={{
              fontSize: 80,
              marginTop: 20,
              transform: [{ scale: heartAnim }],
            }}
          >
            💛
          </Animated.Text>

          <Text style={{ fontSize: 22, marginTop: 20 }}>✔ {right}</Text>
          <Text style={{ fontSize: 22 }}>❌ {wrong}</Text>

          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => {
              setGameOver(false);
              setLevel(1);
              setRight(0);
              setWrong(0);
              setShowIntro(true);
            }}
          >
            <Text style={{ color: "#fff" }}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <ExitPopup />

      {showIntro && (
        <TouchableOpacity style={styles.popupBig} onPress={startGame}>
          <Text style={styles.bigNumber}>🎈 Balloon Game</Text>
          <Text>Tap to Start</Text>
        </TouchableOpacity>
      )}

      {showRoundPopup && (
        <TouchableOpacity style={styles.popupBig} onPress={startRound}>
          <Text style={styles.bigNumber}>{target}</Text>
          <Text>👆 Catch This Number</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🎈 Catch {target} Balloon 🎈</Text>

      <View style={styles.card}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {balloons.map((b) =>
            popped.includes(b.id) ? null : (
              <TouchableOpacity key={b.id} onPress={() => onPop(b)}>
                <Animated.View style={[styles.balloon, { left: b.x, top: b.y }]}>
                  <Text style={[styles.number, { color: COLORS[b.id % COLORS.length] }]}>
                    {b.number}
                  </Text>
                  <BalloonSVG color={COLORS[b.id % COLORS.length]} />
                </Animated.View>
              </TouchableOpacity>
            )
          )}
        </Animated.View>
      </View>

      <Text style={styles.bottomScore}>✔ {right}   ❌ {wrong}</Text>
    </Animated.View>
  );
}

/* STYLES (UNCHANGED) */
const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
    zIndex: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginTop: 60,
    fontWeight: "bold",
  },
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 450,
    backgroundColor: "#fff",
    borderRadius: 25,
    overflow: "hidden",
  },
  balloon: { position: "absolute", alignItems: "center" },
  number: { fontSize: 22, fontWeight: "bold" },
  popupBig: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    backgroundColor: "#FFD54F",
    padding: 40,
    borderRadius: 25,
    zIndex: 999,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },
  btn: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  playBtn: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  bottomScore: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});