// FindEmojiGame.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ALL_ITEMS = [
  { name: "Apple", emoji: "🍎" },
  { name: "Banana", emoji: "🍌" },
  { name: "Grapes", emoji: "🍇" },
  { name: "Carrot", emoji: "🥕" },
  { name: "Tomato", emoji: "🍅" },
];

export default function FindEmojiGame() {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const shuffled = [...ALL_ITEMS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setOptions(selected);
    setTarget(selected[Math.floor(Math.random() * selected.length)]);
  };

  const handlePress = (item) => {
    if (item.name === target.name) {
      Alert.alert("🎉 Correct!", `You found ${item.emoji} ${item.name}`, [
        { text: "Next", onPress: startNewRound },
      ]);
    } else {
      Alert.alert("❌ Try Again", "That’s not the right one!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/threeplay")}
      >
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.question}>
        Find {target?.emoji} {target?.name}
      </Text>

      <View style={styles.optionsRow}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.optionText}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E7", paddingTop: 60 },
  question: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  optionButton: {
    backgroundColor: "#FFDAB9",
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  optionText: { fontSize: 50 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
});
