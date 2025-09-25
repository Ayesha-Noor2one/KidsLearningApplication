import React, { useEffect, useState } from 'react';
import { 
  View, TouchableOpacity, Image, StyleSheet, 
  Text, Alert, ImageBackground, Animated 
} from 'react-native';
import { Link } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

const cardImages = [
  { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/card1.jpg' },
  { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/card2.jpg' },
  { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/card3.jpg' },
  { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/card4.jpg' },
];


function shuffleCards() {
  const paired = [...cardImages, ...cardImages];
  return paired
    .map((img, index) => ({
      id: index + '',
      img,
      flipped: false,
      matched: false,
      scale: new Animated.Value(1),
    }))
    .sort(() => Math.random() - 0.5);
}

export default function FlipMatchScreen() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  function handleCardPress(index) {
    const newCards = [...cards];
    if (newCards[index].flipped || newCards[index].matched || selected.length === 2) return;

    newCards[index].flipped = true;
    const newSelected = [...selected, index];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      const match = newCards[firstIdx].img === newCards[secondIdx].img;
      setTimeout(() => {
        if (match) {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;

        
          [firstIdx, secondIdx].forEach(idx => {
            Animated.sequence([
              Animated.timing(newCards[idx].scale, {
                toValue: 1.2,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(newCards[idx].scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          });
        } else {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
        }
        setCards([...newCards]);
        setSelected([]);
        checkWin([...newCards]);
      }, 800);
    }
  }

  function checkWin(cards) {
    if (cards.every(card => card.matched)) {
      Alert.alert('🎉 Yay!', 'You matched all the cards!');
      setTimeout(() => {
        setCards(shuffleCards());
        setSelected([]);
      }, 1500);
    }
  }

  return (
    <ImageBackground
      source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }}
  
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Link href="/memorygames" style={styles.arrowButton}>
          <Ionicons name="arrow-back" size={40} color="#ff6666" />
        </Link>
        <Text style={styles.title}>Flip & Match</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity 
            key={card.id} 
            onPress={() => handleCardPress(index)} 
            style={styles.card}
          >
            <Animated.View style={{ transform: [{ scale: card.scale }] }}>
              {card.flipped || card.matched ? (
                <Image source={card.img} style={styles.image} />
              ) : (
                <View style={styles.cardBack} />
              )}
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    paddingTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: { position: 'absolute', top: 20, left: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    margin: 10,
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  cardBack: { backgroundColor: '#FFCC80', width: '100%', height: '100%', borderRadius: 12 },
});
