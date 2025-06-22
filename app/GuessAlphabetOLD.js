import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveProgressToDB,
  loadProgressFromDB,
  markDone,
  hasDone,
} from './database';

const PlayScreen = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [sequence, setSequence] = useState("");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const screenName = 'GuessAlphabetOLD';

  useEffect(() => {
    setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
  }, []);

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/wrong.wav"));
    await sound.playAsync();
  };

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/amazing.wav"));
    await sound.playAsync();
  };

  const playVictorySound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/victory.wav"));
    await sound.playAsync();
  };

  const handleLetterPress = async (letter) => {
    if (letter === letters[currentLetterIndex]) {
      await playSuccessSound();
      setSequence((prev) => prev + letter);
      const nextIndex = currentLetterIndex + 1;
      setCurrentLetterIndex(nextIndex);

      if (nextIndex === letters.length) {
        setIsGameComplete(true);
        playVictorySound();
        const kidId = await AsyncStorage.getItem('kidId');
        await markDone(kidId, screenName, 1);
      }
    } else {
      playErrorSound();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/mou.jpg")} style={styles.backgroundImage} />

      {/* Only Back Button (No Home Button) */}
      <View style={styles.header}>
        <Link href="/Alphabets" asChild>
          <TouchableOpacity>
            <FontAwesome name="arrow-left" size={40} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.titleText}>Select the Alphabet in Sequence</Text>

      <View style={styles.bubblesContainer}>
        {shuffledLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.bubble, { backgroundColor: colors[index % colors.length] }]}
            onPress={() => handleLetterPress(letter)}
            disabled={isGameComplete}
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sequenceText}>{sequence}</Text>

      <Modal visible={isGameComplete} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.rewardText}>🎉 Congratulations! 🎉</Text>
            <Text style={styles.rewardSubText}>You completed the game!</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCurrentLetterIndex(0);
                setSequence("");
                setIsGameComplete(false);
                setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
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
  header: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "red",
    marginTop: 130,
    marginBottom: 3,
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
