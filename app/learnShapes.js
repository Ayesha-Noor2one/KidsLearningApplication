import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Image, ImageBackground, Text, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');


const shapes = [
  { 
    shape: 'Circle', 
    relatedImage: require('../assets/images/circle.png'), 
    sound: require('../assets/sounds/circle.wav'),
    description: 'I am a circle. I am rounded with no corners. ' 
  },
  { 
    shape: 'Square', 
    relatedImage: require('../assets/images/sq.png'), 
    sound: require('../assets/sounds/square.wav'),
    description: 'I am a square. I have four equal sides and four corners.' 
  },
  { 
    shape: 'Triangle', 
    relatedImage: require('../assets/images/tr.png'), 
    sound: require('../assets/sounds/triangle.wav'),
    description: 'I am a triangle. I have three sides and three angles.' 
  },
  { 
    shape: 'Rectangle', 
    relatedImage: require('../assets/images/rec.png'), 
    sound: require('../assets/sounds/rectangle.wav'),
    description: 'I am a rectangle. I have four corners and four sides(2 long and 2 short).' 
  },
  { 
    shape: 'Oval', 
    relatedImage: require('../assets/images/Ova.png'), 
    sound: require('../assets/sounds/oval.wav'),
    description: 'I am an oval. I am shaped like an egg and have no corners.' 
  },
  { 
    shape: 'Pentagon', 
    relatedImage: require('../assets/images/pen.png'), 
    sound: require('../assets/sounds/Pentagon.wav'),
    description: 'I am a pentagon. I have five sides and five points.' 
  },
  { 
    shape: 'Hexagon', 
    relatedImage: require('../assets/images/hexa.png'), 
    sound: require('../assets/sounds/hexagon.wav'),
    description: 'I am a hexagon. I have six equal sides and six angles.' 
  },
  { 
    shape: 'Star', 
    relatedImage: require('../assets/images/str.png'), 
    sound: require('../assets/sounds/star.wav'),
    description: 'I am a star. I have ten sides and ten points.' 
  },
  { 
    shape: 'Heart', 
    relatedImage: require('../assets/images/heart.png'), 
    sound: require('../assets/sounds/heart.wav'),
    description: 'I am a heart. I have two rounded tops and one pointed bottom.' 
  },
];

export default function ShapesFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'FredokaOne': require('../assets/fonts/Fredokaone-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const onCardPress = () => {
    playSound(shapes[currentIndex].sound);
  };

  const onSwipeLeft = () => {
    if (currentIndex < shapes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(shapes[newIndex].sound);
      scrollToIndex(newIndex);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(shapes[newIndex].sound);
      scrollToIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 60,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.backgroundImage}>
        <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
          <Pressable onPress={onCardPress}>
            <View style={styles.card}>
              <Text style={styles.shapeText}>{shapes[currentIndex].shape}</Text>
              <Text style={styles.descriptionText}>{shapes[currentIndex].description}</Text>
              <View style={styles.relatedCard}>
                <Image source={shapes[currentIndex].relatedImage} style={styles.relatedImage} />
              </View>
            </View>
          </Pressable>
        </GestureRecognizer>

        <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
          <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === shapes.length - 1}>
          <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === shapes.length - 1 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Link href="/StartScreen" style={styles.homeIcon}>
          <Ionicons name="home" size={40} color="#ff6666" />
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  card: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  shapeText: { fontSize: 70, fontWeight: 'bold', color: '#770000', fontFamily: 'FredokaOne', marginTop: 90 },
  descriptionText: { fontSize: 20, color: '#d0312d', fontWeight:'bold', marginTop: 10, textAlign: 'center' },
  relatedCard: { width: width * 0.5, height: width * 0.6, justifyContent: 'center', alignItems: 'center' },
  relatedImage: { width: '90%', height: '100%', resizeMode: 'contain' },
  arrowLeft: { position: 'absolute', left: 20, bottom: '25%' },
  arrowRight: { position: 'absolute', right: 20, bottom: '25%' },
  homeIcon: { position: 'absolute', top: 20, right: 20 },
});