import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const SHAPES = [
  { id: 1, shape: "●", name: "Circle", color: "#FF6B6B" },
  { id: 2, shape: "■", name: "Square", color: "#4D96FF" },
  { id: 3, shape: "▲", name: "Triangle", color: "#6BCB77" },
  { id: 4, shape: "★", name: "Star", color: "#FFD93D" },
  { id: 5, shape: "♥", name: "Heart", color: "#FF4D6D" },
];

export default function ShapeGame() {
  const router = useRouter();

  const [level, setLevel] = useState(0);
  const [items, setItems] = useState([]);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  const target = SHAPES[level];

  /* BG */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF3C7", "#D7F9FF"],
  });

  /* SHUFFLE */
  useEffect(() => {
    setItems([...SHAPES].sort(() => Math.random() - 0.5));
    Speech.stop();
    Speech.speak(`Find ${target.name}`);
  }, [level]);

  /* ⭐ STAR ANIMATION (FIXED TRIGGER) */
  const playStar = (callback) => {
    setLocked(true);

    starAnim.setValue(0);

    Animated.sequence([
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(starAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLocked(false);
      callback();
    });
  };

  /* DROP */
  const onDrop = (item, pan) => {
    if (locked) return;

    const isCorrect = item.id === target.id;

    if (isCorrect) {
      setRight((r) => r + 1);

      // ⭐ FIX: star animation now runs properly BEFORE level change
      playStar(() => {
        if (level + 1 < SHAPES.length) {
          setLevel((l) => l + 1);
        } else {
          setFinished(true);
        }
      });
    } else {
      setWrong((w) => w + 1);

      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    }
  };

  const Draggable = ({ item }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const onGesture = Animated.event(
      [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
      { useNativeDriver: true }
    );

    const onHandlerState = (e) => {
      if (e.nativeEvent.state === State.END) {
        onDrop(item, pan);
      }
    };

    return (
      <PanGestureHandler onGestureEvent={onGesture} onHandlerStateChange={onHandlerState}>
        <Animated.View
          style={[
            styles.item,
            { backgroundColor: item.color, transform: pan.getTranslateTransform() },
          ]}
        >
          <Text style={styles.itemText}>{item.shape}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  /* FINISHED */
  if (finished) {
    return (
      <View style={styles.reward}>
        <Animated.Text
          style={[
            styles.bigStar,
            {
              transform: [
                {
                  scale: starAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          ⭐
        </Animated.Text>

        <Text style={styles.rewardText}>🥳🎉Great Job!🥳🎉</Text>

        <Text style={styles.scoreText}>✔ {right}</Text>
        <Text style={styles.scoreText}>❌ {wrong}</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Modal transparent visible={showPopup}>
          <View style={styles.popup}>
            <View style={styles.popupBox}>
              <Text>Exit Game?</Text>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "red" }]}
                  onPress={() => setShowPopup(false)}
                >
                  <Text style={{ color: "#fff" }}>No</Text>
                </TouchableOpacity>

                {/* ✅ FIXED NAVIGATION */}
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "green" }]}
                  onPress={() => {
                    Speech.stop();
                    setShowPopup(false);
                    router.push("/three");
                  }}
                >
                  <Text style={{ color: "#fff" }}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="dark-content" />

        {/* POPUP */}
        <Modal transparent visible={showPopup}>
          <View style={styles.popup}>
            <View style={styles.popupBox}>
              <Text>Exit Game?</Text>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "red" }]}
                  onPress={() => setShowPopup(false)}
                >
                  <Text style={{ color: "#fff" }}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "green" }]}
                  onPress={() => {
                    Speech.stop();
                    setShowPopup(false);
                    router.push("/three");
                  }}
                >
                  <Text style={{ color: "#fff" }}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        {/* ⭐ STAR FIXED ANIMATION */}
        <Animated.View
          style={[
            styles.star,
            {
              opacity: starAnim,
              transform: [
                {
                  scale: starAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.8],
                  }),
                },
                {
                  rotate: starAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={{ fontSize: 70 }}>⭐</Text>
        </Animated.View>

        {/* TITLE */}
        <Text style={styles.title}>Match the Shape</Text>

        {/* TARGET */}
        <View style={[styles.target, { backgroundColor: target.color }]}>
          <Text style={styles.targetText}>{target.shape}</Text>
        </View>

        {/* ITEMS */}
        <View style={styles.row}>
          {items.map((i) => (
            <Draggable key={i.id} item={i} />
          ))}
        </View>

        {/* SCORE */}
        <View style={styles.score}>
          <Text>✔ {right}</Text>
          <Text>❌ {wrong}</Text>
          <Text>Level {level + 1}</Text>
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", position: "absolute", top: 60 },
  target: {
    width: 140,
    height: 140,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  targetText: { fontSize: 60, color: "#fff" },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  item: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: { fontSize: 40, color: "#fff" },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
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
  reward: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4F2",
  },
  rewardText: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  bigStar: { fontSize: 90 },
  scoreText: { fontSize: 18, marginTop: 5 },
  star: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
  },
});