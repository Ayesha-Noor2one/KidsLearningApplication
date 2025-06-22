import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Image, ImageBackground, Text } from 'react-native';
import { Audio } from 'expo-av';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

// Vegetables list with image, sound, and description
const vegetables = [
  {
    name: 'Carrot',
    relatedImage: require('../assets/images/carrot.png'),
    sound: require('../assets/sounds/carrot.wav'),
    description: 'A carrot is orange and crunchy. Rabbits love them!'
  },
  {
    name: 'Tomato',
    relatedImage: require('../assets/images/tomato.png'),
    sound: require('../assets/sounds/tomato.wav'),
    description: 'A tomato is red and juicy. It’s used in salads and sauces!'
  },
  {
    name: 'Broccoli',
    relatedImage: require('../assets/images/broccoli.png'),
    sound: require('../assets/sounds/broccoli.wav'),
    description: 'Broccoli looks like a little tree. It’s green and healthy!'
  },
  {
    name: 'Cucumber',
    relatedImage: require('../assets/images/cucumber.png'),
    sound: require('../assets/sounds/cucumber.wav'),
    description: 'A cucumber is long and green. It’s cool and crunchy!'
  },
  {
    name: 'Spinach',
    relatedImage: require('../assets/images/spinach.png'),
    sound: require('../assets/sounds/spinach.wav'),
    description: 'Spinach is soft and green. It helps you grow strong!'
  },
  {
    name: 'Potato',
    relatedImage: require('../assets/images/potato.png'),
    sound: require('../assets/sounds/potato.wav'),
    description: 'A potato is brown outside and soft inside. Yum when mashed!'
  },
  {
    name: 'Onion',
    relatedImage: require('../assets/images/onion.png'),
    sound: require('../assets/sounds/onion.wav'),
    description: 'Onions can make you cry, but they add great taste!'
  },
  {
    name: 'Peas',
    relatedImage: require('../assets/images/peas.png'),
    sound: require('../assets/sounds/peas.wav'),
    description: 'Peas are tiny green balls. They’re sweet and fun to eat!'
  },
  {
    name: 'Cauliflower',
    relatedImage: require('../assets/images/cauliflower.png'),
    sound: require('../assets/sounds/cauliflower.wav'),
    description: 'Cauliflower is white and fluffy like a veggie cloud!'
  },
  {
    name: 'Bell Pepper',
    relatedImage: require('../assets/images/bell pepper.png'),
    sound: require('../assets/sounds/bell pepper.wav'),
    description: 'Bell peppers come in red, yellow, and green. They’re super crunchy!'
  },
  {
    name: 'Corn',
    relatedImage: require('../assets/images/corn.png'),
    sound: require('../assets/sounds/corn.wav'),
    description: 'Corn has tiny yellow kernels. It’s sweet and yummy!'
  },
  {
    name: 'Eggplant',
    relatedImage: require('../assets/images/eggplant.png'),
    sound: require('../assets/sounds/eggplant.wav'),
    description: 'Eggplants are purple and shiny. They’re soft inside!'
  },
  {
    name: 'Pumpkin',
    relatedImage: require('../assets/images/pumpkin.png'),
    sound: require('../assets/sounds/pumpkin.wav'),
    description: 'Pumpkins are big, round, and orange. Great for pies and Halloween!'
  },
  {
    name: 'Lettuce',
    relatedImage: require('../assets/images/lettuce.png'),
    sound: require('../assets/sounds/lettuce.wav'),
    description: 'Lettuce is leafy and green. It’s crunchy in sandwiches!'
  },
  {
    name: 'Zucchini',
    relatedImage: require('../assets/images/zucchini.png'),
    sound: require('../assets/sounds/zucchini.wav'),
    description: 'Zucchini is green and soft. It’s great in stir-fry!'
  },
  {
    name: 'Beetroot',
    relatedImage: require('../assets/images/beetroot.png'),
    sound: require('../assets/sounds/beetroot.wav'),
    description: 'Beetroots are dark red and sweet. They make everything pink!'
  },
  {
    name: 'Mushroom',
    relatedImage: require('../assets/images/mushrooms.png'),
    sound: require('../assets/sounds/mushroom.wav'),
    description: 'Mushrooms are soft and round. They grow like tiny umbrellas!'
  },
  {
    name: 'Radish',
    relatedImage: require('../assets/images/radish.png'),
    sound: require('../assets/sounds/radish.wav'),
    description: 'Radishes are spicy little roots that come in red and white!'
  },
  {
    name: 'GreenBeans',
    relatedImage: require('../assets/images/green beans.png'),
    sound: require('../assets/sounds/greenbeans.wav'),
    description: 'Green beans are long and crunchy. Snap snap!'
  },
  {
    name: 'Turnip',
    relatedImage: require('../assets/images/turnip.png'),
    sound: require('../assets/sounds/turnip.wav'),
    description: 'Turnips are round and white with purple tops. They grow underground!'
  },
  {
    name: 'Cabbage',
    relatedImage: require('../assets/images/cabbage.png'),
    sound: require('../assets/sounds/cabbage.wav'),
    description: 'Cabbage is like a green ball of leaves. It’s super crunchy!'
  },
];

export default function VegetablesFlashcards() {
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
    playSound(vegetables[currentIndex].sound);
  };

  const onSwipeLeft = () => {
    if (currentIndex < vegetables.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(vegetables[newIndex].sound);
      scrollToIndex(newIndex);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(vegetables[newIndex].sound);
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
        <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
          <Pressable onPress={onCardPress}>
            <View style={styles.card}>
              <Text style={styles.nameText}>{vegetables[currentIndex].name}</Text>
              <View style={styles.relatedCard}>
                <Image source={vegetables[currentIndex].relatedImage} style={styles.relatedImage} />
                <Text style={styles.description}>{vegetables[currentIndex].description}</Text>
              </View>
            </View>
          </Pressable>
        </GestureRecognizer>

        <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
          <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === vegetables.length - 1}>
          <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === vegetables.length - 1 ? '#ccc' : '#ff6666'} />
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3E38D',  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  nameText: { fontSize: 65, color: '#336600', fontFamily: 'FredokaOne', fontWeight: 'bold' },
  relatedCard: { paddingtop: 10, width: width * 0.75, height: width * 0.9, justifyContent: 'center', alignItems: 'center' },
  relatedImage: { width: '100%', height: '60%', resizeMode: 'contain' },
  description: { fontSize: 30, color: '#000', textAlign: 'center', paddingTop: 10, fontFamily: 'FredokaOne' },
  arrowLeft: { position: 'absolute', left: 20, bottom: '10%' },
  arrowRight: { position: 'absolute', right: 20, bottom: '10%' },
  homeIcon: { position: 'absolute', top: 20, right: 20 },
  arrowButton: { position: 'absolute', top: 20, left: 20 },
});
