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
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

export default function SingularPluralLearningGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleLeft = useRef(new Animated.Value(1)).current;
  const scaleRight = useRef(new Animated.Value(1)).current;

  const singularplural = [
    {
      leftLabel: "APPLE",
      rightLabel: "APPLES",
      leftEmoji: "🍎",
      rightEmoji: "🍎🍎",
      leftName: "Apple",
      rightName: "Apples",
      leftColor: "#FF6B6B",
      rightColor: "#4D96FF",
      speak: "Apple Apples",
    },
    {
      leftLabel: "CAT",
      rightLabel: "CATS",
      leftEmoji: "🐱",
      rightEmoji: "🐱🐱",
      leftName: "Cat",
      rightName: "Cats",
      leftColor: "#FFD166",
      rightColor: "#6C63FF",
      speak: "Cat Cats",
    },
    {
      leftLabel: "DOG",
      rightLabel: "DOGS",
      leftEmoji: "🐶",
      rightEmoji: "🐶🐶",
      leftName: "Dog",
      rightName: "Dogs",
      leftColor: "#00C9A7",
      rightColor: "#FF4C29",
      speak: "Dog Dogs",
    },
    {
      leftLabel: "BOOK",
      rightLabel: "BOOKS",
      leftEmoji: "📘",
      rightEmoji: "📚",
      leftName: "Book",
      rightName: "Books",
      leftColor: "#845EC2",
      rightColor: "#F9F871",
      speak: "Book Books",
    },
    {
      leftLabel: "CAR",
      rightLabel: "CARS",
      leftEmoji: "🚗",
      rightEmoji: "🚗🚗",
      leftName: "Car",
      rightName: "Cars",
      leftColor: "#6C63FF",
      rightColor: "#FFD166",
      speak: "Car Cars",
    },
    {
      leftLabel: "BALL",
      rightLabel: "BALLS",
      leftEmoji: "⚽",
      rightEmoji: "⚽⚽",
      leftName: "Ball",
      rightName: "Balls",
      leftColor: "#FF9F1C",
      rightColor: "#00B4D8",
      speak: "Ball Balls",
    },
  ];

  
  const current = singularplural[index];

  useEffect(() => {
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
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D6F4FF", "#FFE8F2"],
  });

  const speak = () => {
    setSpeaking(true);
    Speech.stop();

    Speech.speak(current.speak, {
      onDone: () => setSpeaking(false),
    });

    Animated.sequence([
      Animated.spring(scaleLeft, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scaleLeft, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.spring(scaleRight, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scaleRight, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    speak();
  }, [index]);

  const next = () => {
    if (speaking) return;
    if (index < singularplural.length - 1) setIndex(index + 1);
    else setShowReward(true);
  };

  const prev = () => {
    if (speaking) return;
    if (index > 0) setIndex(index - 1);
  };

  const restart = () => {
    setIndex(0);
    setShowReward(false);
  };

  const Popup = () => (
    <Modal transparent visible={showPopup} animationType="fade">
      <View style={styles.popupOverlay}>
        <View style={styles.popupBox}>
          <Text style={styles.popupTitle}>Exit Game?</Text>

          <View style={styles.popupBtns}>
            <TouchableOpacity
              style={[styles.popBtn, { backgroundColor: "#FF6B6B" }]}
              onPress={() => setShowPopup(false)}
            >
              <Text style={styles.popTxt}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => router.push("/five")}
            >
              <Text style={styles.popTxt}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (showReward) {
    return (
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardEmoji}>🏆</Text>
        <Text style={styles.rewardText}>✨Great Job!✨</Text>

        <TouchableOpacity style={styles.restartBtn} onPress={restart}>
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setShowPopup(true)}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Popup />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setShowPopup(true)}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Popup />

      <Text style={styles.title}> ✨Singular Plural ✨</Text>

      <View style={styles.parallelWrap}>
        <View style={styles.side}>
          <Text style={styles.label}>{current.leftLabel}</Text>
          <Animated.Text
            style={{
              transform: [{ translateY: floatAnim }, { scale: scaleLeft }],
              fontSize:
                current.leftName === "Elephant"
                  ? 170
                  : current.leftName === "Giraffe"
                  ? 190
                  : 120,
            }}
          >
            {current.leftEmoji}
          </Animated.Text>

          <View style={[styles.nameCard, { backgroundColor: current.leftColor }]}>
            <Text style={styles.itemName}>{current.leftName}</Text>
          </View>
        </View>

        <View style={styles.side}>
          <Text style={styles.label}>{current.rightLabel}</Text>
          <Animated.Text
            style={{
              transform: [{ translateY: floatAnim }, { scale: scaleRight }],
              fontSize: 110,
            }}
          >
            {current.rightEmoji}
          </Animated.Text>

          <View style={[styles.nameCard, { backgroundColor: current.rightColor }]}>
            <Text style={styles.itemName}>{current.rightName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={prev}
          disabled={speaking}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={next}
          disabled={speaking}
        >
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
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
    position: "absolute",
    top: 70,
    fontSize: 28,
    fontWeight: "bold",
    color: "#e25ce7ff",
  },

  parallelWrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },

  side: {
    alignItems: "center",
    width: "45%",
  },

  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4081",
    marginBottom: 20,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  nameCard: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },

  nav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
    gap: 40,
  },

  navBtn: {
    backgroundColor: "#7d77b0ff",
    padding: 15,
    borderRadius: 30,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#5d6362ff",
    padding: 12,
    borderRadius: 25,
  },

  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },

  rewardEmoji: {
    fontSize: 120,
  },

  rewardText: {
    fontSize: 32,
    fontWeight: "bold",
  },

  restartBtn: {
    marginTop: 25,
    backgroundColor: "#FF6F00",
    padding: 14,
    borderRadius: 14,
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: 280,
    alignItems: "center",
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  popupBtns: {
    flexDirection: "row",
    gap: 15,
  },

  popBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  popTxt: {
    color: "#fff",
    fontWeight: "bold",
  },
});