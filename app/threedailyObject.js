// DailyObjects.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const OBJECTS = [
  { id: "1", emoji: "🚗", name: "Car" },
  { id: "2", emoji: "🧸", name: "Toy" },
  { id: "3", emoji: "🍽️", name: "Plate" },
  { id: "4", emoji: "🥄", name: "Spoon" },
  { id: "5", emoji: "👕", name: "Shirt" },
  { id: "6", emoji: "👟", name: "Shoes" },
  { id: "7", emoji: "🛏️", name: "Bed" },
  { id: "8", emoji: "🚲", name: "Bicycle" },
  { id: "9", emoji: "📱", name: "Mobile" },
  { id: "10", emoji: "🎒", name: "Bag" },
];

export default function DailyObjects() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/three")}>
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.header}>🏠 Daily Life Objects</Text>

      <FlatList
        data={OBJECTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  list: {
    justifyContent: "center",
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#FFFAF0",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 50,
  },
  name: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
});
