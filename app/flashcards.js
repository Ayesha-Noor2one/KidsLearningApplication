import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import {
  saveProgressToDB,
  loadProgressFromDB,
  markDone,
  hasDone,
} from './database';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const router = useRouter();

const letters = [
  { letter: 'Aa', relatedImage: require('../assets/images/apple.png'), sound: require('../assets/sounds/a.wav') },
  { letter: 'Bb', relatedImage: require('../assets/images/ball.png'), sound: require('../assets/sounds/b.wav') },
  { letter: 'Cc', relatedImage: require('../assets/images/caty.png'), sound: require('../assets/sounds/c.wav') },
  { letter: 'Dd', relatedImage: require('../assets/images/dogy.png'), sound: require('../assets/sounds/d.wav') },
  { letter: 'Ee', relatedImage: require('../assets/images/egg.png'), sound: require('../assets/sounds/e.wav') },
  { letter: 'Ff', relatedImage: require('../assets/images/fish (1).png'), sound: require('../assets/sounds/f.wav') },
  { letter: 'Gg', relatedImage: require('../assets/images/goat.png'), sound: require('../assets/sounds/g.wav') },
  { letter: 'Hh', relatedImage: require('../assets/images/house.png'), sound: require('../assets/sounds/h.wav') },
  { letter: 'Ii', relatedImage: require('../assets/images/igloo.png'), sound: require('../assets/sounds/i.wav') },
  { letter: 'Jj', relatedImage: require('../assets/images/jelly.png'), sound: require('../assets/sounds/j.wav') },
  { letter: 'Kk', relatedImage: require('../assets/images/kangaroo.png'), sound: require('../assets/sounds/k.wav') },
  { letter: 'Ll', relatedImage: require('../assets/images/lemon.png'), sound: require('../assets/sounds/l.wav') },
  { letter: 'Mm', relatedImage: require('../assets/images/mango.png'), sound: require('../assets/sounds/m.wav') },
  { letter: 'Nn', relatedImage: require('../assets/images/net (1).png'), sound: require('../assets/sounds/n.wav') },
  { letter: 'Oo', relatedImage: require('../assets/images/orange (1).png'), sound: require('../assets/sounds/o.wav') },
  { letter: 'Pp', relatedImage: require('../assets/images/parrot.png'), sound: require('../assets/sounds/p.wav') },
  { letter: 'Qq', relatedImage: require('../assets/images/queen.png'), sound: require('../assets/sounds/q.wav') },
  { letter: 'Rr', relatedImage: require('../assets/images/rabbit.png'), sound: require('../assets/sounds/r.wav') },
  { letter: 'Ss', relatedImage: require('../assets/images/sun.png'), sound: require('../assets/sounds/s.wav') },
  { letter: 'Tt', relatedImage: require('../assets/images/train.png'), sound: require('../assets/sounds/t.wav') },
  { letter: 'Uu', relatedImage: require('../assets/images/umbrella.png'), sound: require('../assets/sounds/u.wav') },
  { letter: 'Vv', relatedImage: require('../assets/images/voilin.png'), sound: require('../assets/sounds/v.wav') },
  { letter: 'Ww', relatedImage: require('../assets/images/window.png'), sound: require('../assets/sounds/w.wav') },
  { letter: 'Xx', relatedImage: require('../assets/images/xylo.png'), sound: require('../assets/sounds/x.wav') },
  { letter: 'Yy', relatedImage: require('../assets/images/yoyo.png'), sound: require('../assets/sounds/y.wav') },
  { letter: 'Zz', relatedImage: require('../assets/images/zoo.png'), sound: require('../assets/sounds/z.wav') },
];

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const screenName = 'Flashcards';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedLetters, setLearnedLetters] = useState([]);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'FredokaOne': require('../assets/fonts/Fredokaone-Regular.ttf'),
  });

  const checkIfDone = async () => {
    try {
      const kidId = await AsyncStorage.getItem('kidId');
      const res = await hasDone(kidId, screenName);
      if (res?.isDone === 1) {
        Alert.alert('Alphabets!', '100% Completed! 🥳');
        setTimeout(() => {
          router.replace('/Alphabets');
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking if done:', error);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const kidId = await AsyncStorage.getItem('kidId');
        const indexes = await loadProgressFromDB(kidId, screenName);
        const learned = indexes ? indexes.map((item) => item.learned_index) : [];

        setLearnedLetters(learned);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    fetchProgress();
    checkIfDone();
  }, []);

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const markAsLearned = async (index) => {
    if (!learnedLetters.includes(index)) {
      const updated = [...learnedLetters, index];
      setLearnedLetters(updated);
      const kidId = await AsyncStorage.getItem('kidId');
      await saveProgressToDB(kidId, screenName, index);

      if (updated.length === letters.length) {
        await markDone(kidId, screenName, 1);
        Alert.alert('Alphabets!', '100% Completed! 🥳');
        setTimeout(() => {
          router.replace('/Alphabets');
        }, 1000);
      }
    }
  };

  const onCardPress = () => {
    playSound(letters[currentIndex].sound);
    markAsLearned(currentIndex);
  };

  const onSwipeLeft = () => {
    if (currentIndex < letters.length - 1 && learnedLetters.includes(currentIndex)) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playSound(letters[newIndex].sound);
      markAsLearned(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playSound(letters[newIndex].sound);
      scrollToIndex(newIndex);
    }
  };

  const onAlphabetPress = (index) => {
    if (index === 0 || learnedLetters.includes(index - 1)) {
      setCurrentIndex(index);
      playSound(letters[index].sound);
      markAsLearned(index);
      scrollToIndex(index);
    } else {
      Alert.alert('Hold on!', 'Please learn the previous letter first.');
    }
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 60, animated: true });
    }
  };

  const getProgress = () => {
    return Math.round((learnedLetters.length / letters.length) * 100);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.backgroundImage}>
        <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
          <Pressable onPress={onCardPress}>
            <View style={styles.card}>
              <Text style={styles.letterText}>{letters[currentIndex].letter}</Text>
              <View style={styles.relatedCard}>
                <Image source={letters[currentIndex].relatedImage} style={styles.relatedImage} />
              </View>
            </View>
          </Pressable>
        </GestureRecognizer>

        <Pressable onPress={onSwipeRight} style={styles.arrowLeft} disabled={currentIndex === 0}>
          <Ionicons name="arrow-back-circle" size={50} color={currentIndex === 0 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <Pressable onPress={onSwipeLeft} style={styles.arrowRight} disabled={currentIndex === letters.length - 1}>
          <Ionicons name="arrow-forward-circle" size={50} color={currentIndex === letters.length - 1 ? '#ccc' : '#ff6666'} />
        </Pressable>

        <ScrollView
          horizontal
          contentContainerStyle={styles.alphabetsContainer}
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {alphabets.map((letter, index) => (
            <Pressable
              key={index}
              onPress={() => onAlphabetPress(index)}
              disabled={index !== 0 && !learnedLetters.includes(index - 1)}
              style={[
                styles.alphabetBox,
                {
                  backgroundColor:
                    index === 0 || learnedLetters.includes(index - 1)
                      ? getRandomColor()
                      : '#cccccc',
                },
                currentIndex === index && styles.selectedAlphabetBox,
              ]}
            >
              <Text style={styles.alphabetText}>{letter}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.progressText}>Progress: {getProgress()}%</Text>

        <Pressable onPress={() => router.push('/Alphabets')} style={styles.backButton}>
          <Ionicons name="arrow-back-circle" size={45} color="#ff6666" />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const getRandomColor = () => {
  const colors = ['#ff6666', '#ffcc66', '#66ff66', '#66ccff', '#cc66ff', '#ff66cc'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    width: width * 0.95,
    height: height * 0.5,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 75,
  },
  letterText: {
    fontSize: 130,
    color: '#770000',
    fontFamily: 'FredokaOne',
  },
  relatedCard: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#ffd9d9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  relatedImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  arrowLeft: {
    position: 'absolute',
    left: 20,
    bottom: '25%',
    transform: [{ translateY: -25 }],
  },
  arrowRight: {
    position: 'absolute',
    right: 20,
    bottom: '25%',
    transform: [{ translateY: -25 }],
  },
  alphabetsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  alphabetBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 80,
    marginHorizontal: 5,
  },
  alphabetText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedAlphabetBox: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
});
