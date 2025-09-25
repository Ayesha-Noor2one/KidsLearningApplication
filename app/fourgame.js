import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ITEMS = ["🍎", "🍌", "🍇", "🥕", "🍅"];

export default function CountGame() {
  const router = useRouter();
  const [emoji, setEmoji] = useState("🍎");
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomEmoji = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const randomCount = Math.floor(Math.random() * 5) + 2;
    setEmoji(randomEmoji);
    setCount(randomCount);

    const choices = [
      randomCount,
      randomCount + 1,
      randomCount - 1,
    ].sort(() => 0.5 - Math.random());

    setOptions(choices);
  };

  const handleAnswer = (num) => {
    if (num === count) {
      Alert.alert("🎉 Correct!", `There are ${count} ${emoji}`, [
        { text: "Next", onPress: startNewRound },
      ]);
    } else {
      Alert.alert("❌ Try Again");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/fourplay")}
      >
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.header}>Count the Objects 👇</Text>

      {/* Show Emojis */}
      <View style={styles.emojiContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <Text key={i} style={styles.emoji}>{emoji}</Text>
        ))}
      </View>

      {/* Options */}
      <View style={styles.optionsRow}>
        {options.map((num, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionButton}
            onPress={() => handleAnswer(num)}
          >
            <Text style={styles.optionText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8DC", paddingTop: 60 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 40,
  },
  emoji: { fontSize: 40, margin: 5 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#FFDAB9",
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  optionText: { fontSize: 30, fontWeight: "bold" },
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
