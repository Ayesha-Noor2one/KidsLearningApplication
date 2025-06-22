import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; 
import { Link } from 'expo-router'; 


const pairs = [
  { id: 'apple', image: require('../assets/images/apple.png') },
  { id: 'banana', image: require('../assets/images/banana.png') },
  { id: 'car', image: require('../assets/images/cat.png') },
  { id: 'dog', image: require('../assets/images/DOG (1).png') },
  { id: 'house', image: require('../assets/images/house.png') },
  { id: 'avocado', image: require('../assets/images/avocado.png') },
  { id: 'ball', image: require('../assets/images/ball.png') },
  { id: 'bunny', image: require('../assets/images/bunny.png') },
  { id: 'earth', image: require('../assets/images/earth.jpg') },
  { id: 'fish', image: require('../assets/images/fish (1).png') },
  { id: 'igloo', image: require('../assets/images/igloo.png') },
];

export default function MissingPairGame({ navigation }) {
  const [shuffledPairs, setShuffledPairs] = useState([]);
  const [missingItem, setMissingItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [showPairs, setShowPairs] = useState(true);
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false); 

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const selected = pairs.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 11)); 
    const duplicated = [...selected, ...selected];
    const shuffled = duplicated.sort(() => 0.5 - Math.random());

    setShuffledPairs(shuffled);
    setShowPairs(true);
    setMessage('');
    setShowConfetti(false);

    setTimeout(() => {
      const missing = selected[Math.floor(Math.random() * selected.length)];
      const remaining = duplicated.filter(item => item.id !== missing.id);
      const optionsSet = [...selected]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      if (!optionsSet.includes(missing)) {
        optionsSet[Math.floor(Math.random() * 3)] = missing;
      }

      setShuffledPairs(remaining);
      setMissingItem(missing);
      setOptions(optionsSet.sort(() => 0.5 - Math.random()));
      setShowPairs(false);
    }, 3000);
  };

  const handleChoice = (item) => {
    if (item.id === missingItem.id) {
      setMessage('🎉 Correct!');
      setShowConfetti(true); // 
    } else {
      setMessage('❌ Try again!');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const renderOption = (item) => (
    <TouchableOpacity style={styles.optionCard} onPress={() => handleChoice(item)}>
      <Image source={item.image} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Link href="/memorygames" style={styles.backButton}>
  <Ionicons name="arrow-back" size={24} color="black" />
</Link>


      <Text style={styles.title}>Find the Missing Pair</Text>

      <FlatList
        data={shuffledPairs}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        numColumns={3} 
        contentContainerStyle={styles.gridContainer}
      />

      {!showPairs && (
        <>
          <Text style={styles.subtitle}>Which one is missing?</Text>
          <View style={styles.optionsContainer}>
            {options.map((item, index) => renderOption(item))}
          </View>
        </>
      )}

      <Text style={styles.message}>{message}</Text>

      {message && (
        <TouchableOpacity onPress={startGame} style={styles.retryButton}>
          <Text style={styles.retryText}>Play Again</Text>
        </TouchableOpacity>
      )}

      {showConfetti && (
        <LottieView
          source={require('../assets/animations/burst.json')} 
          autoPlay
          loop={false}
          style={styles.confetti}
          onAnimationFinish={() => setShowConfetti(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: 'center', backgroundColor: '#F3E38D', },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 ,color:'orange',},
  subtitle: { fontSize: 20, marginTop: 20, color:'maroon', },
  gridContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 100,
    height: 100,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  image: { width: 80, height: 80, resizeMode: 'contain' },
  optionsContainer: { flexDirection: 'row', marginTop: 10 },
  optionCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFFBEC',
    borderRadius: 12,
  },
  message: { fontSize: 24, marginTop: 20 },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#87CEFA',
    borderRadius: 10,
  },
  retryText: { fontSize: 18, color: 'white' },
  backButton: { position: 'absolute', top: 20, left: 20 },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 999,
  },
});
