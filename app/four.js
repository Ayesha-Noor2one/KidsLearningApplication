import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = width * 0.36;

export default function ThreeYearsGames() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 2, duration: 3000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 3, duration: 3000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["#BEE9FF", "#D7FFD9", "#FFF4C7", "#FFD6F0"],
  });

  const anims = Array.from({ length: 6 }).map(() =>
    useRef(new Animated.Value(0)).current
  );

  const scaleAnims = Array.from({ length: 6 }).map(() =>
    useRef(new Animated.Value(1)).current
  );

  const sunRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -12,
            duration: 800 + i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800 + i * 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    Animated.loop(
      Animated.timing(sunRotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = sunRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handlePress = (index, title, route) => {
    Speech.speak(title);

    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.85,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => router.push(route), 200);
  };

  const buttons = [
    { title: "Alphabets", route: "/fouralphabets", color: "#fe62abff", emoji: "🅰️" },
    { title: "Animals", route: "/fouanimals", color: "#72b1f4ff", emoji: "🐶" },
    { title: "Birds", route: "/fourbirds", color: "#16d510ff", emoji: "🐦" },
    { title: "Parts of Body", route: "/fourpartsofbody", color: "#d7da0dff", emoji: "👀" },
    { title: "Fruits", route: "/fourfruits", color: "#f57272ff", emoji: "🍎" },
    { title: "Vegetables", route: "/fourvegetables", color: "#8847f9ff", emoji: "🥕" },
  ];

  const quizButtons = [
    { title: "Alphabet Quiz", route: "/fouralphabetsquiz", color:  "#fe62abff", emoji: "📝" },
    { title: "Fruits Quiz", route: "/fourfruitsquiz", color: "#72b1f4ff", emoji: "🍓🍉" },
    { title: "Word Build", route: "/fourwordquiz", color: "#16d510ff", emoji: "🧩" },
    { title: "Feed Animals", route: "/fourfeedanimals", color:  "#d7da0dff", emoji: "🍽️🐄" },
    { title: "Pattern Recognition", route: "/fourpattern", color:"#f57272ff", emoji: "🔺🔵" },
    { title: "Counting Quiz", route: "/fourcountquiz", color: "#8847f9ff", emoji: "🎲" },
  ];

  const slide = (dir) => {
    const newPage = page + dir;
    if (newPage < 0 || newPage > 1) return;

    setPage(newPage);

    Animated.spring(slideAnim, {
      toValue: -width * newPage,
      useNativeDriver: true,
    }).start();
  };

  const renderButtons = (data) =>
    data.map((btn, index) => (
      <Animated.View
        key={index}
        style={{
          width: "48%",
          alignItems: "center",
          transform: [
            { translateY: anims[index] },
            { scale: scaleAnims[index] },
          ],
        }}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: btn.color }]}
          onPress={() => handlePress(index, btn.title, btn.route)}
        >
          <Text style={styles.emoji}>{btn.emoji}</Text>
          <Text style={styles.btnText}>{btn.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    ));

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <Animated.View style={[styles.sun, { transform: [{ rotate }] }]}>
        <Text style={{ fontSize: 60 }}>☀️</Text>
      </Animated.View>

      <TouchableOpacity style={styles.backButton} onPress={() => setShowPopup(true)}>
        <Ionicons name="arrow-back" size={14} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Little Star!(4 years)</Text>

      <TouchableOpacity style={styles.leftArrow} onPress={() => slide(-1)}>
        <Ionicons name="chevron-back" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightArrow} onPress={() => slide(1)}>
        <Ionicons name="chevron-forward" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={{ width: "100%", overflow: "hidden" }}>
        <Animated.View
          style={{
            flexDirection: "row",
            width: width * 2,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View style={{ width, alignItems: "center" }}>
            <View style={styles.grid}>{renderButtons(buttons)}</View>
          </View>

          <View style={{ width, alignItems: "center" }}>
            <View style={styles.grid}>{renderButtons(quizButtons)}</View>
          </View>
        </Animated.View>
      </View>

      {showPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>Go to Login Page?</Text>

            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#FF6B6B" }]}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.popupBtnText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupBtn, { backgroundColor: "#00B894" }]}
                onPress={() => {
                  setShowPopup(false);
                  router.replace("/Login");
                }}
              >
                <Text style={styles.popupBtnText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },

  sun: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "#00000040",
    padding: 5,
    borderRadius: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 15,
    backgroundColor: "#ffffffcc",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },

  grid: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  button: {
    width:160 ,
    height:180,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    elevation: 6,
  },

  emoji: {
    fontSize: 38,
  },

  btnText: {
    marginTop: 8,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  leftArrow: {
    position: "absolute",
    left: 10,
    top: "45%",
    backgroundColor: "#00000055",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },

  rightArrow: {
    position: "absolute",
    right: 10,
    top: "45%",
    backgroundColor: "#00000055",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },

  popupOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "75%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  popupText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  popupButtons: {
    flexDirection: "row",
    gap: 15,
  },

  popupBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  popupBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});