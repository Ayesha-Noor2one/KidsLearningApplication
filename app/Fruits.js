import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Image, ImageBackground, Text } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const fruits = [
  { 
    name: 'Apple',
    relatedImage: require('../assets/images/apple (2).png'), 
    sound: require('../assets/sounds/apple.wav'),
    description: 'An apple is sweet and crunchy. It’s red, green, or yellow!'
  },
  { 
    name: 'Banana',
    relatedImage: require('../assets/images/banana.png'), 
    sound: require('../assets/sounds/banana.wav'),
    description: 'A banana is long and yellow. It’s sweet and soft inside!'
  },
  { 
    name: 'Orange',
    relatedImage: require('../assets/images/orange (2).png'), 
    sound: require('../assets/sounds/orange.wav'),
    description: 'An orange is round and orange. It’s juicy and full of vitamin C!'
  },
  { 
    name: 'Strawberry',
    relatedImage: require('../assets/images/strawberry.png'), 
    sound: require('../assets/sounds/strawberry.wav'),
    description: 'Strawberries are red, juicy, and sweet. They have tiny seeds on the outside!'
  },
  { 
    name: 'Avocado',
    relatedImage: require('../assets/images/avocado.png'), 
    sound: require('../assets/sounds/avocado.wav'),
    description: 'A green fruit that’s soft inside and super creamy!'
  },
  { 
    name: 'Pineapple',
    relatedImage: require('../assets/images/Pineapple.png'), 
    sound: require('../assets/sounds/pineapple.wav'),
    description: 'A spiky fruit with juicy yellow inside and a crown on top!'
  },
  { 
    name: 'Watermelon',
    relatedImage: require('../assets/images/watermelon.png'), 
    sound: require('../assets/sounds/watermelon.wav'),
    description: ' A big green fruit with red juicy inside and black seeds!'
  },
  { 
    name: 'Mango',
    relatedImage: require('../assets/images/mango (2).png'), 
    sound: require('../assets/sounds/mango.wav'),
    description: 'A soft, sweet fruit that’s orange-yellow inside!'
  },
  { 
    name: 'Kiwi',
    relatedImage: require('../assets/images/kiwi.png'), 
    sound: require('../assets/sounds/kiwi.wav'),
    description: 'A fuzzy brown fruit with bright green and tiny black seeds inside!'
  },
  { 
    name: 'Blueberry',
    relatedImage: require('../assets/images/Blueberry.png'), 
    sound: require('../assets/sounds/blueberry.wav'),
    description: 'A small round blue fruit that’s sweet and fun to pop!'
  },
  { 
    name: 'Cherry',
    relatedImage: require('../assets/images/cherry.png'), 
    sound: require('../assets/sounds/cherry.wav'),
    description: 'A little red fruit with a long stem and a juicy bite!'
  },
  { 
    name: 'Peach',
    relatedImage: require('../assets/images/peach.png'), 
    sound: require('../assets/sounds/peach.wav'),
    description: 'A soft and fuzzy fruit that’s sweet and juicy inside!'
  },
  { 
    name: 'Apricot',
    relatedImage: require('../assets/images/apricot.png'), 
    sound: require('../assets/sounds/apricot.wav'),
    description: 'A small orange fruit that’s soft, sweet, and smooth!'
  },
  { 
    name: 'Figs',
    relatedImage: require('../assets/images/figs.png'), 
    sound: require('../assets/sounds/figs.wav'),
    description: 'A soft fruit with lots of tiny seeds and a sweet center!'
  },
  { 
    name: 'Plum',
    relatedImage: require('../assets/images/plum.png'), 
    sound: require('../assets/sounds/plum.wav'),
    description: 'A purple fruit that’s juicy and a little tart inside!'
  },
  { 
    name: 'Grapes',
    relatedImage: require('../assets/images/grapes.png'), 
    sound: require('../assets/sounds/grapes.wav'),
    description: 'Tiny round fruits that grow in bunches and taste super sweet or tangy!'
  },
  { 
    name: 'Papaya',
    relatedImage: require('../assets/images/papaya.png'), 
    sound: require('../assets/sounds/papaya.wav'),
    description: 'A big fruit with orange flesh and lots of black seeds!'
  },
  { 
    name: 'Grapefruit ',
    relatedImage: require('../assets/images/grapefruit.png'), 
    sound: require('../assets/sounds/grapefruit.wav'),
    description: 'A big round fruit that’s juicy and a little bit sour!'
  },
];

export default function FruitsFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'FredokaOne': require('../assets/fonts/Fredokaone-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const onCardPress = () => {
    playSound(fruits[currentIndex].sound);
  };

  const onSwipeLeft = () => {
    if (currentIndex < fruits.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(fruits[newIndex].sound);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(fruits[newIndex].sound);
    }
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Pressable onPress={onCardPress}>
          <View style={styles.card}>
            <Text style={styles.shapeText}>{fruits[currentIndex].name}</Text>
            <View style={styles.relatedCard}>
              <Image source={fruits[currentIndex].relatedImage} style={styles.relatedImage} />
              <Text style={styles.description}>{fruits[currentIndex].description}</Text>
            </View>
          </View>
        </Pressable>
      </GestureRecognizer>
  
      <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
        <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
      </Pressable>
  
      <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === fruits.length - 1}>
        <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === fruits.length - 1 ? '#ccc' : '#ff6666'} />
      </Pressable>
  
      <Link href="/StartScreen" style={styles.homeIcon}>
        <Ionicons name="home" size={40} color="#ff6666" />
      </Link>
      <Link href="/fruitvege" style={styles.arrowButton}>
        <Ionicons name="arrow-back" size={40} color="#ff6666" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E38D', 
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  shapeText: {
    fontSize: 65,
    color: '#ff6600',
    fontFamily: 'FredokaOne',
    fontWeight: 'bold',
  },
  relatedCard: {
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  relatedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 30,
    color: '#8b0000',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'FredokaOne',
  },
  arrowLeft: { position: 'absolute', left: 20, bottom: '10%' },
  arrowRight: { position: 'absolute', right: 20, bottom: '10%' },
  homeIcon: { position: 'absolute', top: 20, right: 20 },
  arrowButton: { position: 'absolute', top: 20, left: 20 },
});

