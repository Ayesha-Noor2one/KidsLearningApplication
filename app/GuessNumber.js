import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markDone } from './database';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ALL_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);
const TOTAL_OPTIONS = 3;

export default function NumberGuessGame() {
  const [remaining, setRemaining] = useState([...ALL_NUMBERS]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [options, setOptions] = useState([]);
  const [showBurst, setShowBurst] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const screenName = 'GuessNumber';
const isGameComplete = () => remaining.length === 0;
  const generateQuestion = () => {
    if (remaining.length === 0) return;
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const number = remaining[randomIndex];
    const wrongOptions = ALL_NUMBERS
      .filter((n) => n !== number)
      .sort(() => 0.5 - Math.random())
      .slice(0, TOTAL_OPTIONS - 1);
    const allOptions = [...wrongOptions, number].sort(() => 0.5 - Math.random());
    setCurrentNumber(number);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
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
    if (selected === currentNumber) {
      setShowBurst(true);
      setTimeout(() => {
        setShowBurst(false);
        setRemaining((prev) => prev.filter((n) => n !== currentNumber));
      }, 800);
    } else {
      shake();
    }
  };

  const answeredCount = ALL_NUMBERS.length - remaining.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Which Number is This?</Text>
      <Text style={styles.counter}>
        {answeredCount + 1} / {ALL_NUMBERS.length}
      </Text>

      <View style={styles.numberContainer}>
        <Text style={styles.number}>{currentNumber}</Text>
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

      {remaining.length === 0 && (
        <Text style={styles.completeText}>🎉 You completed all numbers!</Text>
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
  numberContainer: {
    marginBottom: 40,
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  number: {
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
