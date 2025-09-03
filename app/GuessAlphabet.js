import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markDone } from './database';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ALL_ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TOTAL_OPTIONS = 3;

export default function AlphabetGuessGame() {
  const [remaining, setRemaining] = useState([...ALL_ALPHABETS]);
  const [currentAlphabet, setCurrentAlphabet] = useState('');
  const [options, setOptions] = useState([]);
  const [showBurst, setShowBurst] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const screenName = 'GuessAlphabet';
  const router = useRouter();

  const isGameComplete = () => remaining.length === 0;

  useEffect(() => {
    if (!isGameComplete()) return;
    (async () => {
      try {
        const kidId = await AsyncStorage.getItem('kidId');
        await markDone(kidId, screenName, 1);
      } catch (err) {
        console.error('Error marking done:', err);
      }
    })();
  }, [remaining]);

  const generateQuestion = () => {
    if (isGameComplete()) return;
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const letter = remaining[randomIndex];
    const wrongOptions = ALL_ALPHABETS
      .filter((l) => l !== letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, TOTAL_OPTIONS - 1);
    const allOptions = [...wrongOptions, letter].sort(() => 0.5 - Math.random());
    setCurrentAlphabet(letter);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
  }, [remaining]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (selected) => {
    if (isGameComplete()) return;

    if (selected === currentAlphabet) {
      setShowBurst(true);
      setTimeout(() => {
        setShowBurst(false);
        setRemaining((prev) => prev.filter((l) => l !== currentAlphabet));
      }, 800);
    } else {
      shake();
    }
  };

  const answeredCount = ALL_ALPHABETS.length - remaining.length;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Alphabets')}>
        <FontAwesome name="arrow-left" size={36} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Which Alphabet is This?</Text>
      <Text style={styles.counter}>
        {answeredCount + 1} / {ALL_ALPHABETS.length}
      </Text>

      <View style={styles.alphabetContainer}>
        <Text style={styles.alphabet}>{currentAlphabet}</Text>
      </View>

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
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        ))}
      </Animated.View>

      {showBurst && (
        <LottieView
          source={require('../assets/animations/burst.json')}
          autoPlay
          loop={false}
          style={styles.burst}
        />
      )}

      {isGameComplete() && (
        <Text style={styles.completeText}>🎉 You completed all alphabets!</Text>
      )}
    </View>
  );
}

const getColorByIndex = (index) => {
  const colors = ['#FFB6C1', '#87CEFA', '#90EE90'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9EC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  counter: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  alphabetContainer: {
    marginBottom: 40,
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  alphabet: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  optionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  pressed: {
    opacity: 0.7,
  },
  burst: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '30%',
  },
  completeText: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
});
