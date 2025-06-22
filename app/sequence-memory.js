import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Switch } from 'react-native';
import LottieView from 'lottie-react-native';

const BASE_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan'];

const SequenceMemoryGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [level, setLevel] = useState(1);
  const [showLottie, setShowLottie] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [disableTimer, setDisableTimer] = useState(false);

  const timerRef = useRef(null); // Track interval ID

  useEffect(() => {
    if (gameStarted) {
      startNewGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    // Cleanup timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getAvailableColors = () => {
    const colorCount = Math.min(4 + Math.floor(level / 2), BASE_COLORS.length);
    return BASE_COLORS.slice(0, colorCount);
  };

  const getRandomColor = () => {
    const availableColors = getAvailableColors();
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };

  const startNewGame = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Clear timer before restarting
    const newColor = getRandomColor();
    setSequence([newColor]);
    setUserInput([]);
    setIsUserTurn(false);
    setLevel(1);
    setShowLottie(false);
    setTimeLeft(disableTimer ? 0 : 5);
    setTimerActive(false);
    playSequence([newColor]);
  };

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setHighlightIndex(i);
      await new Promise((res) => setTimeout(res, 600 / level));
      setHighlightIndex(-1);
      await new Promise((res) => setTimeout(res, 200));
    }
    setIsUserTurn(true);
    setUserInput([]);
    if (!disableTimer) {
      startTimer();
    }
  };

  const handleUserTap = (color) => {
    if (!isUserTurn || timerActive) return;

    const newUserInput = [...userInput, color];
    setUserInput(newUserInput);

    const currentIndex = newUserInput.length - 1;
    if (color !== sequence[currentIndex]) {
      Alert.alert('Oops!', 'Wrong sequence. Try again.', [
        { text: 'Restart', onPress: startNewGame }
      ]);
      return;
    }

    if (newUserInput.length === sequence.length) {
      const nextColor = getRandomColor();
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      setIsUserTurn(false);
      setLevel(level + 1);
      setShowLottie(true);
      setTimeout(() => {
        setShowLottie(false);
        playSequence(newSequence);
      }, 1000);
    }
  };

  const startTimer = () => {
    if (disableTimer) return;

    setTimerActive(true);
    let countdown = 5;
    setTimeLeft(countdown);

    timerRef.current = setInterval(() => {
      countdown--;
      setTimeLeft(countdown);

      if (countdown <= 0) {
        clearInterval(timerRef.current);
        setTimerActive(false);
        Alert.alert("Time's Up!", 'You ran out of time. Try again.', [
          { text: 'Restart', onPress: startNewGame }
        ]);
      }
    }, 1000);
  };

  const availableColors = getAvailableColors();

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setGameStarted(true)}
        >
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.levelText}>Level: {level}</Text>
          {!disableTimer && <Text style={styles.countdownText}>{timeLeft}s</Text>}

          {showLottie && (
            <LottieView
              source={require('../assets/burst.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          )}

          <View style={styles.grid}>
            {availableColors.map((color, index) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                    opacity: highlightIndex === index ? 1 : 0.5,
                  },
                ]}
                onPress={() => handleUserTap(color)}
                activeOpacity={0.6}
              />
            ))}
          </View>

          <View style={styles.timerSwitchContainer}>
            <Text style={styles.timerSwitchText}>Disable Timer</Text>
            <Switch
              value={disableTimer}
              onValueChange={(value) => setDisableTimer(value)}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    justifyContent: 'center',
  },
  colorButton: {
    width: 90,
    height: 90,
    margin: 10,
    borderRadius: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: '30%',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerSwitchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerSwitchText: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default SequenceMemoryGame;
