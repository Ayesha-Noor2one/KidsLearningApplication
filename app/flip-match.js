import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { Link } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

// ✅ Reduced to 4 card types for kids
const cardImages = [
  require('../assets/images/card1.jpg'),
  require('../assets/images/card2.jpg'),
  require('../assets/images/card3.jpg'),
  require('../assets/images/card4.jpg'),
];

function shuffleCards() {
  const paired = [...cardImages, ...cardImages]; // 4 pairs = 8 cards
  return paired
    .map((img, index) => ({ id: index + '', img, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
}

export default function FlipMatchScreen() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    setCards(shuffleCards());
    playBackgroundMusic();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function playBackgroundMusic() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/bg.mp3'),
      { isLooping: true, volume: 0.1 }
    );
    setSound(sound);
    await sound.playAsync();
  }

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
      // Wait a bit and load next round
      setTimeout(() => {
        setCards(shuffleCards());
        setSelected([]);
      }, 1500);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/ga.jpg')}
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
          <TouchableOpacity key={card.id} onPress={() => handleCardPress(index)} style={styles.card}>
            {card.flipped || card.matched ? (
              <Image source={card.img} style={styles.image} />
            ) : (
              <View style={styles.cardBack} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
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
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardBack: {
    backgroundColor: '#FFCC80',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
