import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markDone } from './database';

const PlayScreen = () => {
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const [sequence, setSequence] = useState("");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const screenName = 'CountingPlay';

  useEffect(() => {
    setShuffledNumbers([...numbers].sort(() => Math.random() - 0.5));
  }, []);

  const handleNumberPress = async (number) => {
    if (number === numbers[currentNumberIndex]) {
      setSequence((prev) => prev + number);
      setCurrentNumberIndex(currentNumberIndex + 1);

      if (currentNumberIndex + 1 === numbers.length) {
        setIsGameComplete(true);
        const kidId = await AsyncStorage.getItem('kidId');
        await markDone(kidId, screenName, 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }} style={styles.backgroundImage} />

      <Link href="/Counting" asChild>
        <TouchableOpacity style={styles.backButton}>
          <FontAwesome name="arrow-left" size={36} color="black" />
        </TouchableOpacity>
      </Link>

      <View style={styles.bubblesContainer}>
        {shuffledNumbers.map((number, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.bubble, { backgroundColor: colors[index % colors.length] }]}
            onPress={() => handleNumberPress(number)}
            disabled={isGameComplete}
          >
            <Text style={styles.letter}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sequenceText}>{sequence}</Text>

      <Modal visible={isGameComplete} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.rewardText}>🎉 Congratulations! 🎉</Text>
            <Text style={styles.rewardSubText}>You completed the game!</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCurrentNumberIndex(0);
                setSequence("");
                setIsGameComplete(false);
                setShuffledNumbers([...numbers].sort(() => Math.random() - 0.5));
              }}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const colors = ["#FFD700", "#FF4500", "#8A2BE2", "#32CD32", "#1E90FF", "#FF1493"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  bubblesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  bubble: {
    width: 55,
    height: 55,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  letter: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  sequenceText: {
    fontSize: 40,
    color: "white",
    marginTop: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  rewardText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  rewardSubText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlayScreen;
