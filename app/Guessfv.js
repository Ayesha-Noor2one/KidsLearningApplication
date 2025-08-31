import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

// Fruits
const fruits = [
  { name: "Apple", relatedImage: require("../assets/images/apple (2).png") },
  { name: "Banana", relatedImage: require("../assets/images/banana.png") },
  { name: "Orange", relatedImage: require("../assets/images/orange (2).png") },
  { name: "Strawberry", relatedImage: require("../assets/images/strawberry.png") },
  { name: "Avocado", relatedImage: require("../assets/images/avocado.png") },
  { name: "Pineapple", relatedImage: require("../assets/images/Pineapple.png") },
  { name: "Watermelon", relatedImage: require("../assets/images/watermelon.png") },
  { name: "Mango", relatedImage: require("../assets/images/mango (2).png") },
  { name: "Kiwi", relatedImage: require("../assets/images/kiwi.png") },
  { name: "Blueberry", relatedImage: require("../assets/images/Blueberry.png") },
  { name: "Cherry", relatedImage: require("../assets/images/cherry.png") },
  { name: "Peach", relatedImage: require("../assets/images/peach.png") },
  { name: "Apricot", relatedImage: require("../assets/images/apricot.png") },
  { name: "Figs", relatedImage: require("../assets/images/figs.png") },
  { name: "Plum", relatedImage: require("../assets/images/plum.png") },
  { name: "Grapes", relatedImage: require("../assets/images/grapes.png") },
  { name: "Papaya", relatedImage: require("../assets/images/papaya.png") },
  { name: "Grapefruit", relatedImage: require("../assets/images/grapefruit.png") },
];

// Vegetables
const vegetables = [
  { name: "Carrot", relatedImage: require("../assets/images/carrot.png") },
  { name: "Tomato", relatedImage: require("../assets/images/tomato.png") },
  { name: "Broccoli", relatedImage: require("../assets/images/broccoli.png") },
  { name: "Cucumber", relatedImage: require("../assets/images/cucumber.png") },
  { name: "Spinach", relatedImage: require("../assets/images/spinach.png") },
  { name: "Potato", relatedImage: require("../assets/images/potato.png") },
  { name: "Onion", relatedImage: require("../assets/images/onion.png") },
  { name: "Peas", relatedImage: require("../assets/images/peas.png") },
  { name: "Cauliflower", relatedImage: require("../assets/images/cauliflower.png") },
  { name: "Bell Pepper", relatedImage: require("../assets/images/bell pepper.png") },
  { name: "Corn", relatedImage: require("../assets/images/corn.png") },
  { name: "Eggplant", relatedImage: require("../assets/images/eggplant.png") },
  { name: "Pumpkin", relatedImage: require("../assets/images/pumpkin.png") },
  { name: "Lettuce", relatedImage: require("../assets/images/lettuce.png") },
  { name: "Zucchini", relatedImage: require("../assets/images/zucchini.png") },
  { name: "Beetroot", relatedImage: require("../assets/images/beetroot.png") },
  { name: "Mushroom", relatedImage: require("../assets/images/mushrooms.png") },
  { name: "Radish", relatedImage: require("../assets/images/radish.png") },
  { name: "Green Beans", relatedImage: require("../assets/images/green beans.png") },
  { name: "Turnip", relatedImage: require("../assets/images/turnip.png") },
  { name: "Cabbage", relatedImage: require("../assets/images/cabbage.png") },
];

export default function GuessFV() {
  const router = useRouter();

  const allItems = [...fruits, ...vegetables];
  const [shuffledItems, setShuffledItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [burst, setBurst] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const shakeAnim = new Animated.Value(0);

  useEffect(() => {
    shuffleItems();
  }, []);

  const shuffleItems = () => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setCurrentIndex(0);
    setGameComplete(false);
  };

  const handleAnswer = (option) => {
    if (option.name === shuffledItems[currentIndex].name) {
      setBurst(true);

      setTimeout(() => {
        setBurst(false);
        if (currentIndex + 1 < shuffledItems.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setGameComplete(true);
        }
      }, 1000);
    } else {
      // Shake animation for wrong answer
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  if (!shuffledItems.length) return null;

  if (gameComplete) {
    return (
      <View style={styles.center}>
        <Text style={styles.congrats}>🎉 Congrats! You finished the game 🎉</Text>
        <TouchableOpacity style={styles.button} onPress={shuffleItems}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "grey" }]}
          onPress={() => router.push("/fruitvege")}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentItem = shuffledItems[currentIndex];
  const options = [...allItems]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .concat(currentItem)
    .sort(() => Math.random() - 0.5);

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          Alert.alert("Go Back", "Do you want to go back?", [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: () => router.push("/fruitvege") },
          ])
        }
      >
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Which Fruit or Vegetable is this?</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <Image source={currentItem.relatedImage} style={styles.image} />
      </Animated.View>

      <View style={styles.options}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {burst && (
        <LottieView
          source={require("../assets/burst.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  image: { width: 200, height: 200, resizeMode: "contain", marginBottom: 20 },
  options: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  option: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 15, margin: 8 },
  optionText: { color: "white", fontSize: 18, fontWeight: "bold" },
  lottie: { width: 150, height: 150, position: "absolute", top: "40%" },
  center: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", padding: 20 },
  congrats: { fontSize: 24, fontWeight: "bold", color: "green", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#2196F3", padding: 12, borderRadius: 10, marginVertical: 8 },
  buttonText: { fontSize: 18, color: "white" },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "#eee", borderRadius: 30 },
});
