import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const planets = [
  {
    name: 'Mercury',
    relatedImage: require('../assets/images/mercury.jpg'),
    sound: require('../assets/sounds/mercury.wav'),
    description: 'Mercury is the closest planet to the Sun. It’s small, rocky, and super hot!',
  },
  {
    name: 'Venus',
    relatedImage: require('../assets/images/venus.jpg'),
    sound: require('../assets/sounds/venus.wav'),
    description: 'Venus is covered in thick clouds and is even hotter than Mercury!',
  },
  {
    name: 'Earth',
    relatedImage: require('../assets/images/earth.jpg'),
    sound: require('../assets/sounds/earth.wav'),
    description: 'Earth is our home! It’s the only planet we know with life and oceans.',
  },
  {
    name: 'Mars',
    relatedImage: require('../assets/images/mars.webp'),
    sound: require('../assets/sounds/mars.wav'),
    description: 'Mars is called the Red Planet. It has the tallest volcano in the solar system!',
  },
  {
    name: 'Jupiter',
    relatedImage: require('../assets/images/jupitor.jpg'),
    sound: require('../assets/sounds/jupiter.wav'),
    description: 'Jupiter is the biggest planet! It’s a gas giant with a giant red storm.',
  },
  {
    name: 'Saturn',
    relatedImage: require('../assets/images/saturn.jpg'),
    sound: require('../assets/sounds/saturn.wav'),
    description: 'Saturn has beautiful rings made of ice and rock. It’s a gas giant too!',
  },
  {
    name: 'Uranus',
    relatedImage: require('../assets/images/uranus.jpg'),
    sound: require('../assets/sounds/uranus.wav'),
    description: 'Uranus spins on its side and has faint rings. It’s a chilly planet!',
  },
  {
    name: 'Neptune',
    relatedImage: require('../assets/images/neptune.jpg'),
    sound: require('../assets/sounds/neptune.wav'),
    description: 'Neptune is deep blue, windy, and super far from the Sun!',
  },
];

export default function SolarSystemFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    'FredokaOne': require('../assets/fonts/Fredokaone-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const onCardPress = () => {
    playSound(planets[currentIndex].sound);
  };

  const onSwipeLeft = () => {
    if (currentIndex < planets.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(planets[newIndex].sound);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(planets[newIndex].sound);
    }
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Pressable onPress={onCardPress}>
          <View style={styles.card}>
            <Text style={styles.planetText}>{planets[currentIndex].name}</Text>
            <View style={styles.relatedCard}>
              <Image source={planets[currentIndex].relatedImage} style={styles.relatedImage} />
              <Text style={styles.description}>{planets[currentIndex].description}</Text>
            </View>
          </View>
        </Pressable>
      </GestureRecognizer>

      <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
        <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#4b87ff'} />
      </Pressable>

      <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === planets.length - 1}>
        <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === planets.length - 1 ? '#ccc' : '#4b87ff'} />
      </Pressable>

      <Link href="/StartScreen" style={styles.homeIcon}>
        <Ionicons name="home" size={40} color="#4b87ff" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001f3f', // space vibes
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  planetText: {
    fontSize: 65,
    color: '#ffd700',
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
    fontSize: 26,
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'FredokaOne',
  },
  arrowLeft: { position: 'absolute', left: 20, bottom: '10%' },
  arrowRight: { position: 'absolute', right: 20, bottom: '10%' },
  homeIcon: { position: 'absolute', top: 20, right: 20 },
});
