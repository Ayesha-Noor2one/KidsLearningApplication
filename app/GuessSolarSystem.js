
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { FontAwesome } from "@expo/vector-icons";

const planetsData = [
  { name: "Mercury", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mercury.jpg" } },
  { name: "Venus", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/venus.jpg" } },
  { name: "Earth", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/earth.jpg" } },
  { name: "Mars", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mars.webp" } },
  { name: "Jupiter", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/jupitor.jpg" } },
  { name: "Saturn", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/saturn.jpg" } },
  { name: "Uranus", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/uranus.jpg" } },
  { name: "Neptune", image: { uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/neptune.jpg" } },
];


function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function GuessSolarSystem() {
  const router = useRouter();
  const [planets, setPlanets] = useState(shuffleArray(planetsData));
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (current < planets.length) {
      generateOptions();
    } else {
      setShowCongrats(true);
    }
  }, [current, planets]);

  const generateOptions = () => {
    let tempOptions = [planets[current].name];
    while (tempOptions.length < 3) {
      let random = planets[Math.floor(Math.random() * planets.length)].name;
      if (!tempOptions.includes(random)) {
        tempOptions.push(random);
      }
    }
    setOptions(tempOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (option) => {
    if (option === planets[current].name) {
      setShowBurst(true);
      setTimeout(() => {
        setShowBurst(false);
        setCurrent((prev) => prev + 1);
      }, 1000);
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const confirmGoBack = () => {
    Alert.alert("Go Back", "Do you want to go back?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => router.push("/solarsystem") },
    ]);
  };

  const restartGame = () => {
    setPlanets(shuffleArray(planetsData)); 
    setCurrent(0);
    setShowCongrats(false);
  };

  if (showCongrats) {
    return (
      <View style={styles.center}>
        <Text style={styles.congrats}>🎉 Congratulations! 🎉</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Replay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "tomato" }]}
          onPress={() => router.push("/solarsystem")}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!planets[current]) return null; 

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={confirmGoBack}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      
      <Text style={styles.question}>Which planet is this?</Text>

      
      <Animated.View
        style={{
          transform: [{ translateX: shakeAnim }],
          alignItems: "center",
        }}
      >
        <Image source={planets[current].image} style={styles.image} />
      </Animated.View>

     
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showBurst && (
        <LottieView
          source={require("../assets/animations/burst.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  option: {
    backgroundColor: "#4b87ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 8,
    minWidth: 90,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  lottie: {
    width: 200,
    height: 200,
    position: "absolute",
    top: "40%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  congrats: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4b87ff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4b87ff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    width: 180,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
