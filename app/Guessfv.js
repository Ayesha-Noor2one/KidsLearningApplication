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


const fruits = [
  { name: "Apple", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/apple%20(2).png" } },
  { name: "Banana", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/banana.png" } },
  { name: "Orange", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/orange%20(2).png" } },
  { name: "Strawberry", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/strawberry.png" } },
  { name: "Avocado", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/avocado.png" } },
  { name: "Pineapple", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/Pineapple.png" } },
  { name: "Watermelon", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/watermelon.png" } },
  { name: "Mango", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mango%20(2).png" } },
  { name: "Kiwi", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/kiwi.png" } },
  { name: "Blueberry", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/Blueberry.png" } },
  { name: "Cherry", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/cherry.png" } },
  { name: "Peach", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/peach.png" } },
  { name: "Apricot", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/apricot.png" } },
  { name: "Figs", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/figs.png" } },
  { name: "Plum", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/plum.png" } },
  { name: "Grapes", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/grapes.png" } },
  { name: "Papaya", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/papaya.png" } },
  { name: "Grapefruit", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/grapefruit.png" } },
];

const vegetables = [
  { name: "Carrot", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/carrot.png" } },
  { name: "Tomato", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/tomato.png" } },
  { name: "Broccoli", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/broccoli.png" } },
  { name: "Cucumber", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/cucumber.png" } },
  { name: "Spinach", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/spinach.png" } },
  { name: "Potato", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/potato.png" } },
  { name: "Onion", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/onion.png" } },
  { name: "Peas", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/peas.png" } },
  { name: "Cauliflower", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/cauliflower.png" } },
  { name: "Bell Pepper", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/bell%20pepper.png" } },
  { name: "Corn", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/corn.png" } },
  { name: "Eggplant", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/eggplant.png" } },
  { name: "Pumpkin", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/pumpkin.png" } },
  { name: "Lettuce", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/lettuce.png" } },
  { name: "Zucchini", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/zucchini.png" } },
  { name: "Beetroot", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/beetroot.png" } },
  { name: "Mushroom", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mushrooms.png" } },
  { name: "Radish", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/radish.png" } },
  { name: "Green Beans", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/green%20beans.png" } },
  { name: "Turnip", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/turnip.png" } },
  { name: "Cabbage", relatedImage: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/cabbage.png" } },
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
