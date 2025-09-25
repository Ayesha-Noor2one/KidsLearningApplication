import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CountingGame() {
  const [count, setCount] = useState(0);
  const totalCircles = 5;

  const handleTap = () => {
    if (count < totalCircles) {
      setCount(count + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap the Circles</Text>
      <Text style={styles.counter}>
        {count}/{totalCircles}
      </Text>
      <View style={styles.circlesContainer}>
        {[...Array(totalCircles)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.circle,
              { backgroundColor: count > i ? "#81c784" : "#64b5f6" },
            ]}
            onPress={handleTap}
          />
        ))}
      </View>
      {count === totalCircles && (
        <Text style={styles.success}>🎉 Great Job! 🎉</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  counter: { fontSize: 20, marginBottom: 20 },
  circlesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  success: { fontSize: 26, fontWeight: "bold", color: "#2e7d32", marginTop: 20 },
});
