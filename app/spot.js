import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const IMAGE_OPTIONS = [
  require('../assets/images/apple.png'),
  require('../assets/images/banana.png'),
  require('../assets/images/grapes.png'),
  require('../assets/images/orange (1).png'),
  require('../assets/images/watermelon.png'),
  require('../assets/images/strawberry.png'),
  require('../assets/images/Pineapple.png'),
  require('../assets/images/kiwi.png'),
  require('../assets/images/mango.png'),
  require('../assets/images/Blueberry.png'),
];

const getRandomImage = () =>
  IMAGE_OPTIONS[Math.floor(Math.random() * IMAGE_OPTIONS.length)];

export default function SpotTheDifferenceScreen() {
  const [originalGrid, setOriginalGrid] = useState([]);
  const [modifiedGrid, setModifiedGrid] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [changedIndex, setChangedIndex] = useState(null);
  const [gamePhase, setGamePhase] = useState('memorize');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newGrid = Array.from({ length: 8 }, () => getRandomImage());
    const indexToChange = Math.floor(Math.random() * newGrid.length);
    let newImage;
    do {
      newImage = getRandomImage();
    } while (newImage === newGrid[indexToChange]);

    const modified = [...newGrid];
    modified[indexToChange] = newImage;

    setOriginalGrid(newGrid);
    setChangedIndex(indexToChange);
    setIsHidden(false);
    setGamePhase('memorize');

    setTimeout(() => {
      setIsHidden(true);
      setTimeout(() => {
        setModifiedGrid(modified);
        setIsHidden(false);
        setGamePhase('guess');
      }, 1000);
    }, 3000);
  };

  const handleChoice = (index) => {
    if (index === changedIndex) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        Alert.alert('🎉 Correct!', 'You spotted the change!', [
          { text: 'Next', onPress: startNewRound },
        ]);
      }, 2000);
    } else {
      Alert.alert('❌ Oops!', 'That’s not the changed item. Try again.', [
        { text: 'Try Again', onPress: startNewRound },
      ]);
    }
  };

  const renderGrid = (grid) => (
    <View style={styles.grid}>
      {grid.map((img, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => gamePhase === 'guess' && handleChoice(index)}
          disabled={gamePhase !== 'guess'}
          style={styles.item}
        >
          <Image source={img} style={styles.image} />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Link href="/memorygames" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </Link>

      <Text style={styles.title}>
        {gamePhase === 'memorize'
          ? 'Look carefully!'
          : gamePhase === 'guess'
          ? 'Which one changed?'
          : ''}
      </Text>

      {!isHidden ? (
        renderGrid(gamePhase === 'guess' ? modifiedGrid : originalGrid)
      ) : (
        <Text style={styles.hiddenText}>🫣</Text>
      )}

      {showConfetti && (
        <LottieView
          source={require('../assets/confetti.json')}
          autoPlay
          loop={false}
          style={styles.confetti}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: '#F3E38D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'orange',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 320,
  },
  item: {
    width: 120,
    height: 120,
    margin: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  hiddenText: {
    fontSize: 40,
    marginTop: 60,
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
});
