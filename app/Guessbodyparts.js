import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BODY_PARTS = [
  { name: "Head", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/head.jpg" } },
  { name: "Eyes", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/eyes.jpg" } },
  { name: "Ears", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/ear.jpg" } },
  { name: "Nose", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/nose.jpg" } },
  { name: "Mouth", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mouth.jpg" } },
  { name: "Hands", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/hands.jpg" } },
  { name: "Feet", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/feet.jpg" } },
  { name: "Arms", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/arm.jpg" } },
  { name: "Legs", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/legs.jpg" } },
  { name: "Fingers", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/fingers.jpg" } },
  { name: "Toes", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/toes.jpg" } },
  { name: "Knees", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/knee.jpg" } },
  { name: "Elbows", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/elbow.jpg" } },
  { name: "Teeth", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/teeth.jpg" } },
  { name: "Tongue", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/tongue.jpg" } },
  { name: "Chest", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/chest.webp" } },
  { name: "Shoulders", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/shoulder.jpg" } },
  { name: "Neck", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/neck.jpg" } },
  { name: "Hair", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/hair.jpg" } },
  { name: "Nails", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/nail.jpg" } },
];


export default function BodyPartsGuessGame() {
  const navigation = useNavigation();
  const [remaining, setRemaining] = useState([...BODY_PARTS]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [showBurst, setShowBurst] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const isGameComplete = () => remaining.length === 0;

  useEffect(() => {
    if (!isGameComplete()) {
      generateQuestion();
    }
  }, [remaining]);

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const correctPart = remaining[randomIndex];

    const wrongOptions = BODY_PARTS.filter((bp) => bp.name !== correctPart.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const allOptions = [...wrongOptions, correctPart].sort(
      () => 0.5 - Math.random()
    );

    setCurrent(correctPart);
    setOptions(allOptions);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (selected) => {
    if (isGameComplete()) return;

    if (selected === current.name) {
      setShowBurst(true);
      setTimeout(() => {
        setShowBurst(false);
        setRemaining((prev) =>
          prev.filter((bp) => bp.name !== current.name)
        );
      }, 800);
    } else {
      shake();
    }
  };

  const handleBackPress = () => {
    Alert.alert("Confirm", "Do you really want to go back?", [
      { text: "No" },
      { text: "Yes", onPress: () => navigation.navigate("bodyparts") },
    ]);
  };

  return (
    <View style={styles.container}>
     
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </Pressable>

      <Text style={styles.title}>Which Body Part is This?</Text>

      {current && (
        <View style={styles.imageContainer}>
          <Image source={current.image} style={styles.image} />
        </View>
      )}

      {!isGameComplete() && (
        <Animated.View
          style={[
            styles.optionsContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          {options.map((opt, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.optionButton,
                { backgroundColor: getColorByIndex(idx) },
                pressed && styles.pressed,
              ]}
              onPress={() => handleAnswer(opt.name)}
            >
              <Text style={styles.optionText}>{opt.name}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}

      {showBurst && (
        <LottieView
          source={require("../assets/animations/burst.json")}
          autoPlay
          loop={false}
          style={styles.burst}
        />
      )}

      {isGameComplete() && (
        <View style={styles.completeBox}>
          <Text style={styles.completeText}>🎉 Congrats! You completed all body parts!</Text>
          <Pressable
            style={[styles.optionButton, { backgroundColor: "#28a745" }]}
            onPress={() => setRemaining([...BODY_PARTS])}
          >
            <Text style={styles.optionText}>Restart</Text>
          </Pressable>
          <Pressable
            style={[styles.optionButton, { backgroundColor: "#FF6347" }]}
            onPress={() => navigation.navigate("bodyparts")}
          >
            <Text style={styles.optionText}>Go Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const getColorByIndex = (index) => {
  const colors = ["#FFB6C1", "#87CEFA", "#90EE90"];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9EC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  imageContainer: {
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  image: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.5,
    resizeMode: "contain",
  },
  optionsContainer: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
  },
  optionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  pressed: {
    opacity: 0.7,
  },
  burst: {
    position: "absolute",
    width: 200,
    height: 200,
    top: "30%",
  },
  completeBox: {
    marginTop: 30,
    alignItems: "center",
    gap: 15,
  },
  completeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 20,
    textAlign: "center",
  },
});
