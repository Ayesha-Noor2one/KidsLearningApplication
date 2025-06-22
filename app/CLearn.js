import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, ImageBackground, Text, Alert,
  Pressable
 } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markDone } from './database';
const { width, height } = Dimensions.get('window');

const numbers = [
  { number: '1', relatedImage: require('../assets/images/1.jpg'), sound: require('../assets/sounds/one.wav') },
  { number: '2', relatedImage: require('../assets/images/2.jpg'), sound: require('../assets/sounds/two.wav') },
  { number: '3', relatedImage: require('../assets/images/3.jpg'), sound: require('../assets/sounds/three.wav') },
  { number: '4', relatedImage: require('../assets/images/4.jpg'), sound: require('../assets/sounds/four.wav') },
  { number: '5', relatedImage: require('../assets/images/5.jpg'), sound: require('../assets/sounds/five.wav') },
  { number: '6', relatedImage: require('../assets/images/6.jpg'), sound: require('../assets/sounds/six.wav') },
  { number: '7', relatedImage: require('../assets/images/7.jpg'), sound: require('../assets/sounds/seven.wav') },
  { number: '8', relatedImage: require('../assets/images/8.jpg'), sound: require('../assets/sounds/eight.wav') },
  { number: '9', relatedImage: require('../assets/images/9.jpg'), sound: require('../assets/sounds/nine.wav') },
  { number: '10', relatedImage: require('../assets/images/10.jpg'), sound: require('../assets/sounds/ten.wav') },
];

export default function CountingFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(new Array(numbers.length).fill(false)); // Track completion of each number
  const scrollViewRef = useRef(null);
const screenName = 'CountingLearn';
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

  const onSwipeLeft = () => {
    if (currentIndex < numbers.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(numbers[newIndex].sound);
      markCompleted(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(numbers[newIndex].sound);
      markCompleted(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const markCompleted = (index) => {
    // Mark the current number as completed
    const updatedCompleted = [...completed];
    updatedCompleted[index] = true;
    setCompleted(updatedCompleted);
    checkAllCompleted(updatedCompleted);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 60,
        animated: true,
      });
    }
  };

  // Check if all numbers are completed
  const checkAllCompleted = async(completedList) => {    
    if (completedList.every((status) => status)) {
      
       const kidId = await AsyncStorage.getItem('kidId');
        await markDone(kidId, screenName, 1);
        showCompletedMessage(); // All numbers are completed
    }
  };

  // Show completed message
  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.backgroundImage}>
        <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
          <View style={styles.card}>
            <Text style={styles.numberText}>{numbers[currentIndex].number}</Text>
            <View style={styles.relatedCard}>
              <Image source={numbers[currentIndex].relatedImage} style={styles.relatedImage} />
            </View>
          </View>
        </GestureRecognizer>

        <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
          <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === numbers.length - 1}>
          <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === numbers.length - 1 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Link href="/StartScreen" style={styles.homeIcon}>
          <Ionicons name="home" size={40} color="#ff6666" />
        </Link>
        <Link href="/counting" style={styles.arrowButton}>
          <Ionicons name="arrow-back" size={40} color="#ff6666" />
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  card: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  numberText: { fontSize: 150, color: '#770000', fontFamily: 'FredokaOne' },
  relatedCard: { width: width * 0.5, height: width * 0.9, justifyContent: 'center', alignItems: 'center' },
  relatedImage: { width: '90%', height: '150%', resizeMode: 'contain' },
  arrowLeft: { position: 'absolute', left: 20, bottom: '25%' },
  arrowRight: { position: 'absolute', right: 20, bottom: '25%' },
  homeIcon: { position: 'absolute', top: 20, right: 20 },
  arrowButton: { position: 'absolute', top: 20, left: 20 },
});
