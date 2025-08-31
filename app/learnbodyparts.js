import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const bodyParts = [
    {
      name: 'Head',
      relatedImage: require('../assets/images/head.jpg'),
      sound: require('../assets/sounds/head.wav'),
      description: 'This is your head! It holds your brain and helps you think!'
    },
    {
      name: 'Eyes',
      relatedImage: require('../assets/images/eyes.jpg'),
      sound: require('../assets/sounds/eyes.wav'),
      description: 'Eyes help you see the world around you!'
    },
    {
      name: 'Ears',
      relatedImage: require('../assets/images/ear.jpg'),
      sound: require('../assets/sounds/ears.wav'),
      description: 'With ears, you can hear music, voices, and sounds!'
    },
    {
      name: 'Nose',
      relatedImage: require('../assets/images/nose.jpg'),
      sound: require('../assets/sounds/nose.wav'),
      description: 'The nose helps you smell yummy food and fresh flowers!'
    },
    {
      name: 'Mouth',
      relatedImage: require('../assets/images/mouth.jpg'),
      sound: require('../assets/sounds/mouth.wav'),
      description: 'You talk, eat, and smile with your mouth!'
    },
    {
      name: 'Hands',
      relatedImage: require('../assets/images/hands.jpg'),
      sound: require('../assets/sounds/hands.wav'),
      description: 'Hands help you grab, hold, wave, and high-five!'
    },
    {
      name: 'Feet',
      relatedImage: require('../assets/images/feet.jpg'),
      sound: require('../assets/sounds/feet.wav'),
      description: 'You use your feet to walk, run, and dance!'
    },
    {
      name: 'Arms',
      relatedImage: require('../assets/images/arm.jpg'),
      sound: require('../assets/sounds/arms.wav'),
      description: 'Arms help you lift, carry, and wave!'
    },
    {
      name: 'Legs',
      relatedImage: require('../assets/images/legs.jpg'),
      sound: require('../assets/sounds/legs.wav'),
      description: 'Legs help you stand, walk, run, and jump!'
    },
    {
      name: 'Fingers',
      relatedImage: require('../assets/images/fingers.jpg'),
      sound: require('../assets/sounds/fingers.wav'),
      description: 'Fingers help you grab, point, and play!'
    },
    {
      name: 'Toes',
      relatedImage: require('../assets/images/toes.jpg'),
      sound: require('../assets/sounds/toes.wav'),
      description: 'Toes help you balance and stand tall!'
    },
    {
      name: 'Knees',
      relatedImage: require('../assets/images/knee.jpg'),
      sound: require('../assets/sounds/knees.wav'),
      description: 'Knees help you bend and move!'
    },
    {
      name: 'Elbows',
      relatedImage: require('../assets/images/elbow.jpg'),
      sound: require('../assets/sounds/elbows.wav'),
      description: 'Elbows help your arms bend and stretch!'
    },
    {
      name: 'Teeth',
      relatedImage: require('../assets/images/teeth.jpg'),
      sound: require('../assets/sounds/teeth.wav'),
      description: 'Teeth help you chew your food!'
    },
    {
      name: 'Tongue',
      relatedImage: require('../assets/images/tongue.jpg'),
      sound: require('../assets/sounds/tongue.wav'),
      description: 'The tongue helps you taste food and speak words!'
    },
    {
      name: 'Chest',
      relatedImage: require('../assets/images/chest.webp'),
      sound: require('../assets/sounds/chest.wav'),
      description: 'The chest holds your heart and lungs!'
    },
    {
      name: 'Shoulders',
      relatedImage: require('../assets/images/shoulder.jpg'),
      sound: require('../assets/sounds/shoulders.wav'),
      description: 'Your shoulders help you carry things and move your arms!'
    },
    {
      name: 'Neck',
      relatedImage: require('../assets/images/neck.jpg'),
      sound: require('../assets/sounds/neck.wav'),
      description: 'The neck supports your head and lets you turn it!'
    },
    {
      name: 'Hair',
      relatedImage: require('../assets/images/hair.jpg'),
      sound: require('../assets/sounds/hair.wav'),
      description: 'Hair grows on your head and helps keep you warm!'
    },
    {
      name: 'Nails',
      relatedImage: require('../assets/images/nail.jpg'),
      sound: require('../assets/sounds/nails.wav'),
      description: 'Nails protect your fingers and toes and help you pick things up!'
    },
  ];
  

export default function BodyPartsFlashcards() {
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
    playSound(bodyParts[currentIndex].sound);
  };

  const onSwipeLeft = () => {
    if (currentIndex < bodyParts.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(bodyParts[newIndex].sound);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(bodyParts[newIndex].sound);
    }
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Pressable onPress={onCardPress}>
          <View style={styles.card}>
            <Text style={styles.shapeText}>{bodyParts[currentIndex].name}</Text>
            <View style={styles.relatedCard}>
              <Image source={bodyParts[currentIndex].relatedImage} style={styles.relatedImage} />
              <Text style={styles.description}>{bodyParts[currentIndex].description}</Text>
            </View>
          </View>
        </Pressable>
      </GestureRecognizer>

      <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
        <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
      </Pressable>

      <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === bodyParts.length - 1}>
        <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === bodyParts.length - 1 ? '#ccc' : '#ff6666'} />
      </Pressable>

      <Link href="/StartScreen" style={styles.homeIcon}>
        <Ionicons name="home" size={40} color="#ff6666" />
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
});
