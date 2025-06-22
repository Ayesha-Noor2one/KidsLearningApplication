import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const animalData = [
    {
      name: 'Cow',
      image: require('../assets/images/cow.jpg'),
      sound: require('../assets/sounds/cow.mp3'),
    },
    {
      name: 'Dog',
      image: require('../assets/images/dog.jpg'),
      sound: require('../assets/sounds/dog.mp3'),
    },
    {
      name: 'Cat',
      image: require('../assets/images/cat.jpg'),
      sound: require('../assets/sounds/cat.mp3'),
    },
    {
      name: 'Sheep',
      image: require('../assets/images/sheep.jpg'),
      sound: require('../assets/sounds/sheep.mp3'),
    },
    {
      name: 'Duck',
      image: require('../assets/images/duck.jpg'),
      sound: require('../assets/sounds/duck.mp3'),
    },
    {
      name: 'Lion',
      image: require('../assets/images/lion.jpg'),
      sound: require('../assets/sounds/lion.mp3'),
    },
    {
      name: 'Elephant',
      image: require('../assets/images/elephant.jpg'),
      sound: require('../assets/sounds/elephant.mp3'),
    },
    {
      name: 'Horse',
      image: require('../assets/images/horse.jpg'),
      sound: require('../assets/sounds/horse.mp3'),
    },
    {
      name: 'Pig',
      image: require('../assets/images/pig.jpg'),
      sound: require('../assets/sounds/pig.mp3'),
    },
    {
      name: 'Monkey',
      image: require('../assets/images/monkey.jpg'),
      sound: require('../assets/sounds/monkey.mp3'),
    },
  ];
  

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const AnimalSoundMatchScreen = () => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const imageCards = animalData.map((item, index) => ({
      id: `img-${index}`,
      type: 'image',
      name: item.name,
      content: item.image,
    }));

    const soundCards = animalData.map((item, index) => ({
      id: `snd-${index}`,
      type: 'sound',
      name: item.name,
      content: item.sound,
    }));

    const shuffled = shuffleArray([...imageCards, ...soundCards]);
    setCards(shuffled);
  }, []);

  const handlePress = async (card) => {
    if (selected.length === 2 || matched.find((m) => m.id === card.id)) return;

    setSelected((prev) => [...prev, card]);

    if (card.type === 'sound') {
      const { sound } = await Audio.Sound.createAsync(card.content);
      await sound.playAsync();
    }

    if (selected.length === 1) {
      const first = selected[0];
      const second = card;

      setTimeout(() => {
        if (
          first.name === second.name &&
          first.type !== second.type
        ) {
          setMatched((prev) => [...prev, first, second]);
          Speech.speak(first.name);
        }
        setSelected([]);
      }, 1000);
    }
  };

  const renderCard = (card) => {
    const isFlipped = selected.find((c) => c.id === card.id) || matched.find((c) => c.id === card.id);
    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          matched.find((m) => m.id === card.id) && styles.matchedCard,
        ]}
        onPress={() => handlePress(card)}
      >
        {isFlipped ? (
          card.type === 'image' ? (
            <Image source={card.content} style={styles.image} />
          ) : (
            <Text style={styles.soundLabel}>🔊</Text>
          )
        ) : (
          <View style={styles.cardBack} />
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      Alert.alert('Well done!', 'You matched all the animals! 🥳');
    }
  }, [matched]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Sound Match</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {cards.map((card) => renderCard(card))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimalSoundMatchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7EC',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 12,
    backgroundColor: '#F0E68C',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  matchedCard: {
    backgroundColor: '#98FB98',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 12,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  soundLabel: {
    fontSize: 32,
    color: '#333',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60, // Prevent last row from being cut off
  },
});
