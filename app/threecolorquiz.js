import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Modal,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";

/* 🎨 COLORS */
const COLORS = [
  { color: "#FF3B30", name: "red" },
  { color: "#FF9500", name: "orange" },
  { color: "#FFCC00", name: "yellow" },
  { color: "#34C759", name: "green" },
  { color: "#007AFF", name: "blue" },
  { color: "#AF52DE", name: "purple" },
  { color: "#5856D6", name: "indigo" },
  { color: "#5AC8FA", name: "sky" },
];

/* 🧩 SHAPES */
const SHAPES = [
  { name: "heart", color: "#FF3B30", path: "M150 50 C 60 50, 60 180, 150 220 C 240 180,240 50,150 50" },
  { name: "star", color: "#FFCC00", path: "M150 40 L180 120 L260 120 L200 170 L220 250 L150 200 L80 250 L100 170 L40 120 L120 120 Z" },
  { name: "circle", color: "#007AFF", path: "M150,100 A80,80 0 1,1 149,100" },
  { name: "triangle", color: "#34C759", path: "M70 250 L150 50 L230 250 Z" },
  { name: "square", color: "#AF52DE", path: "M70 70 H230 V230 H70 Z" },
  { name: "diamond", color: "#FF9500", path: "M150 40 L230 150 L150 260 L70 150 Z" },
  { name: "leaf", color: "#34C759", path: "M150 40 C80 80,80 200,150 260 C220 200,220 80,150 40" },
  { name: "moon", color: "#5856D6", path: "M180 60 A110 110 0 1 0 180 260 A80 80 0 1 1 180 60" },
  { name: "drop", color: "#007AFF", path: "M150 40 C110 100,110 140,150 260 C190 140,190 100,150 40" },
  { name: "cloud", color: "#5AC8FA", path: "M120 180 C80 180,80 140,120 140 C130 100,190 100,200 140 C240 140,240 180,200 180 Z" },
];

export default function PaintGame() {
  const router = useRouter();

  const [level, setLevel] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].color);
  const [fillColor, setFillColor] = useState(null);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [popup, setPopup] = useState(false);
  const [reward, setReward] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const bg = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  const shape = SHAPES[level];

  /* BG */
  useEffect(() => {
    Animated.loop(
      Animated.timing(bg, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const bgColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFE9F3", "#E6F7FF"],
  });

  /* TITLE */
  useEffect(() => {
    Animated.loop(
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF3B30", "#007AFF"],
  });

  /* STAR FLOAT */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: -20, duration: 800, useNativeDriver: true }),
        Animated.timing(starAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* START */
  useEffect(() => {
    if (level < SHAPES.length) {
      setFillColor(null);
      Speech.speak(`Fill the shape ${shape.name}`);
    }
  }, [level]);

  /* SHAKE */
  const wrongShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* LOGIC */
  const handleFill = () => {
    if (selectedColor === shape.color) {
      setFillColor(selectedColor);
      setRight(r => r + 1);

      setTimeout(() => {
        if (level === SHAPES.length - 1) {
          setReward(true);
        } else {
          setLevel(l => l + 1);
        }
      }, 300);

    } else {
      setWrong(w => w + 1);
      wrongShake();
    }
  };

  /* 🎉 REWARD SCREEN */
  if (reward) {
    return (
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>

        {/* BACK BTN */}
        <TouchableOpacity onPress={() => setPopup(true)} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        {/* POPUP */}
        <Modal visible={popup} transparent>
          <View style={styles.overlay}>
            <View style={styles.popup}>
              <Text>Exit Game?</Text>

              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <TouchableOpacity style={styles.no} onPress={() => setPopup(false)}>
                  <Text style={{ color: "#fff" }}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.yes} onPress={() => router.push("/three")}>
                  <Text style={{ color: "#fff" }}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={{ fontSize: 30 }}>🎉 Great Job!</Text>

        {/* ⭐ BIG CENTER STAR */}
        <Animated.Text
          style={{
            fontSize: 120,
            marginVertical: 20,
            transform: [{ translateY: starAnim }],
          }}
        >
          ⭐
        </Animated.Text>

        {/* ✅ COUNTS */}
        <Text style={{ fontSize: 18 }}>✔ Right: {right}</Text>
        <Text style={{ fontSize: 18 }}>❌ Wrong: {wrong}</Text>

        {/* 🔁 PLAY AGAIN */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setLevel(0);
            setRight(0);
            setWrong(0);
            setReward(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>

      {/* BACK */}
      <TouchableOpacity onPress={() => setPopup(true)} style={styles.backBtn}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {/* POPUP */}
      <Modal visible={popup} transparent>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text>Exit Game?</Text>

            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity style={styles.no} onPress={() => setPopup(false)}>
                <Text style={{ color: "#fff" }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.yes} onPress={() => router.push("/three")}>
                <Text style={{ color: "#fff" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TITLE */}
      <Animated.Text style={[styles.title, { color: titleColor }]}>
        Fill the shape
      </Animated.Text>

      {/* CARD */}
      <Animated.View style={[styles.card, { transform: [{ translateX: shake }] }]}>
        <Svg height="300" width="300">
          <Path
            d={shape.path}
            fill={fillColor || "#EEE"}
            stroke="#333"
            strokeWidth={4}
            onPress={handleFill}
          />
        </Svg>

        {/* TARGET */}
        <View style={styles.target}>
          <View style={[styles.dot, { backgroundColor: shape.color }]} />
          <Text>target</Text>
        </View>
      </Animated.View>

      {/* COLORS */}
      <View style={styles.colors}>
        {COLORS.map((c, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedColor(c.color)}
            style={[
              styles.colorBtn,
              { backgroundColor: c.color },
              selectedColor === c.color && { borderWidth: 3 }
            ]}
          />
        ))}
      </View>

      {/* SCORE */}
      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
      </View>

    </Animated.View>
  );
}

/* STYLE */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60 },

  title: { fontSize: 24, fontWeight: "bold" },

  card: {
    width: 340,
    height: 340,
    backgroundColor: "#fff",
    borderRadius: 25,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },

target: {
  position: "absolute",
  right: 15,
  top: 15,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,   // 👈 width barhata hai
  paddingVertical: 6,      // 👈 height barhata hai
  backgroundColor: "#ffffffcc", // 👈 thora visible box
  borderRadius: 15
},

  dot: { width: 14, height: 14, borderRadius: 10, marginRight: 5 },

  colors: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20
  },

  colorBtn: {
    width: 55,
    height: 55,
    borderRadius: 30,
    margin: 6
  },

  score: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    gap: 40
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 20
  },

  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center"
  },

  popup: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20
  },

  yes: {
    backgroundColor: "green",
    padding: 10,
    marginLeft: 10,
    borderRadius: 10
  },

  no: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10
  },

  btn: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10
  }
});