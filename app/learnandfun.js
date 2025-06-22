// app/learnandfun.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasDone } from './database';
const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;
const flashScreen = 'Flashcards';
const findTheLetter = 'FindTheLetter';
const countingPlay = 'CountingPlay';
const countingLearn = 'CountingLearn';

export default function LearnAndFun() {
  const router = useRouter();
  const [flashDone, setflashDone] = useState(0);
    const [findLetterDone, setFindLetterDone] = useState(0);
const [countPlayDone, setCountPlayDone] = useState(0);
  const [countLearnDone, setCountLearnDone] = useState(0);

  const navigateTo = (path) => {
    router.push(path);
  };

  const checkIfDone = async () => {
    try {
      const kidId = await AsyncStorage.getItem('kidId');
      const flash = await hasDone(kidId, flashScreen);
      const letter = await hasDone(kidId, findTheLetter);
      const cPlay = await hasDone(kidId, countingPlay);
            const cLearn = await hasDone(kidId, countingLearn);
      if (flash?.isDone === 1) {
        setflashDone(1);
      }
      if (letter?.isDone === 1) {
        setFindLetterDone(1);
      }
      if (cPlay?.isDone === 1) {
        setCountPlayDone(1);
      }
      if (cLearn?.isDone === 1) {
        setCountLearnDone(1);
      }
    } catch (error) {
      console.error('Error checking if done:', error);
    }
  };

  useEffect(() => {
    checkIfDone();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      {/* Back button navigates to StartScreen */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/StartScreen')}>
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.header}>Learn & Fun</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6F61' }]}
          onPress={() => navigateTo('/Alphabets')}
        >
          

          <Text style={styles.cardTitle}>
                        🅰️  Alphabets
                        {(flashDone === 1 && findLetterDone ===1) ? (
                          <Ionicons name="checkmark-circle" size={30} color="green" style={styles.tickIcon} />
                        ) : (
                          <Ionicons name="hourglass" size={30} color="white" style={styles.tickIcon} />
                        )}
                      </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6A5ACD' }]}
          onPress={() => navigateTo('/Counting')}
        >

          <Text style={styles.cardTitle}>
                        🎲 Counting
                        {(countPlayDone === 1 && countLearnDone ===1) ? (
                          <Ionicons name="checkmark-circle" size={30} color="green" style={styles.tickIcon} />
                        ) : (
                          <Ionicons name="hourglass" size={30} color="white" style={styles.tickIcon} />
                        )}
                      </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#20B2AA' }]}
          onPress={() => navigateTo('/shapes')}
        >
          <Text style={styles.buttonText}>🔺 Shapes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFA500' }]}
          onPress={() => navigateTo('/bodyparts')}
        >
          <Text style={styles.buttonText}>🧍‍♂️ Body Parts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF69B4' }]}
          onPress={() => navigateTo('/solarsystem')}
        >
          <Text style={styles.buttonText}>🌞 Solar System</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#32CD32' }]}
          onPress={() => navigateTo('/fruitvege')}
        >
          <Text style={styles.buttonText}>🍎🍆 Fruits & Veggies</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF4500' }]}
          onPress={() => navigateTo('/color')}
        >
          <Text style={styles.buttonText}>🎨 Colors</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: 'center',
    paddingBottom: 60,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 40,
    fontFamily: 'Consolas',
    backgroundColor: '#fff9',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  button: {
    width: BUTTON_WIDTH,
    paddingVertical: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Consolas',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
});
