import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { Audio } from 'expo-av'; 
import LottieView from 'lottie-react-native'; 

const GRID_SIZE = 3;
const TOTAL_CIRCLES = GRID_SIZE * GRID_SIZE;
const screenWidth = Dimensions.get('window').width;
const circleSize = screenWidth / GRID_SIZE - 20;

const GameScreen = () => {
  const [dogIndex, setDogIndex] = useState(Math.floor(Math.random() * TOTAL_CIRCLES));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [sound, setSound] = useState();
  const [isPlayingConfetti, setIsPlayingConfetti] = useState(false);
  
  const router = useRouter(); 

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
      setIsPlayingConfetti(true);
    }
  }, [timer]);

  useEffect(() => {
    if (score > 0) {
      playSnapSound();
    }
  }, [score]);

  const playSnapSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/snap.mp3') // Add snap sound to assets
    );
    setSound(sound);
    await sound.playAsync();
  };

  const handlePress = (index) => {
    if (index === dogIndex && !gameOver) {
      setScore(score + 1);
      setDogIndex(Math.floor(Math.random() * TOTAL_CIRCLES));
    }
  };

  const renderCircles = () => {
    return Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
      const isDog = index === dogIndex;
      return (
        <TouchableOpacity
          key={index}
          style={styles.circle}
          onPress={() => handlePress(index)}
        >
          {isDog && (
            <Image
              source={require('../assets/images/DOG (1).png')} // Your uploaded dog image
              style={styles.dog}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    });
  };

  const restartGame = () => {
    setScore(0);
    setTimer(30);
    setGameOver(false);
    setIsPlayingConfetti(false);
    setDogIndex(Math.floor(Math.random() * TOTAL_CIRCLES)); // Reset the dog position
    setSound(null); // Reset sound state
  };

  return (
    <View style={styles.container}>
      {/* Home Icon */}
      <TouchableOpacity onPress={() => router.push('/start')} style={styles.homeIcon}>
        <Ionicons name="home" size={32} color="black" />
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.heading}>Whack-a-Mole</Text>

      {/* Score */}
      <Text style={styles.score}>Score: {score}</Text>

      {/* Grid */}
      <View style={styles.grid}>{renderCircles()}</View>

      {/* Timer */}
      {!gameOver ? (
        <Text style={styles.timer}>Time: {timer}s</Text>
      ) : (
        <Text style={styles.gameOver}>Game Over! Final Score: {score}</Text>
      )}

      {/* Restart Button */}
      {gameOver && (
        <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
          <Text style={styles.restartButtonText}>Restart Game</Text>
        </TouchableOpacity>
      )}

      {/* Confetti Animation */}
      {isPlayingConfetti && (
        <LottieView
          source={require('../assets/confetti.json')} // Your confetti animation
          autoPlay
          loop={false}
          style={styles.confetti}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  homeIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'purple',
    margintop: 60,
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
    color: 'purple',
  },
  timer: {
    fontSize: 24,
    marginTop: 20,
    color: 'purple',
  },
  gameOver: {
    fontSize: 24,
    color: 'red',
    marginTop: 20,
  },
  restartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 18,
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth - 20,
    justifyContent: 'center',
  },
  circle: {
    width: circleSize,
    height: circleSize,
    margin: 5,
    borderRadius: circleSize / 2,
    backgroundColor: '#b3e5fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dog: {
    width: circleSize * 0.6,
    height: circleSize * 0.6,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default GameScreen;
