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


const levels = [
  {
    type: "traffic",
    title: "Traffic Light",
    emoji: "🚦",
    items: [
      { emoji: "🟥", name: "STOP" },
      { emoji: "🟩", name: "GO" },
    ],
  },
  {
    type: "animals",
    title: "Animals vs Pets",
    emoji: "🐶",
    items: [
      { emoji: "🐶", name: "PET" },
      { emoji: "🐄", name: "ANIMAL" },
    ],
  },
  {
    type: "fruits",
    title: "Fruits vs Vegetables",
    emoji: "🍎",
    items: [
      { emoji: "🍎", name: "FRUIT" },
      { emoji: "🥕", name: "VEGETABLE" },
    ],
  },
  {
    type: "weather",
    title: "Weather",
    emoji: "🌦️",
    items: [
      { emoji: "☀️", name: "SUNNY" },
      { emoji: "🌧️", name: "RAINY" },
      { emoji: "❄️", name: "COLD" },
    ],
  },
];

export default function RealWorldGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const current = levels[index];

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 2, duration: 2500, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#D7F9FF", "#FFF3C7", "#E5FFE5"],
  });

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

 
  const speak = (text) => {
    setLocked(true);

    Speech.stop();
    Speech.speak(text, {
      rate: 0.9,
      pitch: 1.2,
      onDone: () => setLocked(false),
    });
  };


  const handleTap = (item) => {
    if (locked) return;
    speak(item.name);
  };


  const next = () => {
    if (locked) return;

    if (index === levels.length - 1) {
      setShowReward(true);
    } else {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (locked) return;
    if (index > 0) setIndex(index - 1);
  };

 
  if (showReward) {
    return (
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardTitle}>🎉 Amazing!</Text>
        <Text style={styles.rewardSub}>You learned real world awareness 🌍</Text>
        <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            setIndex(0);
            setShowReward(false);
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

      <Text style={styles.title}>{current.title}</Text>

     
      <Animated.Text
        style={[
          styles.bigEmoji,
          { transform: [{ translateY: floatAnim }] },
        ]}
        onPress={() => speak(current.title)}
      >
        {current.emoji}
      </Animated.Text>

    
      <View style={styles.row}>
        {current.items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => handleTap(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.name}</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    position: "absolute",
    top: 60,
  },

  bigEmoji: {
    fontSize: 120,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#ffffffaa",
    margin: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  emoji: {
    fontSize: 50,
  },

  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  nav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
    gap: 40,
  },

  navBtn: {
    backgroundColor: "#00000055",
    padding: 12,
    borderRadius: 30,
  },

 
  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },

  rewardTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },

  rewardSub: {
    marginTop: 10,
    fontSize: 18,
  },

  stars: {
    fontSize: 40,
    marginTop: 20,
  },

  restartBtn: {
    marginTop: 30,
    backgroundColor: "#ff69b4",
    padding: 12,
    borderRadius: 20,
  },
});