import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Vibration,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign';

const ALL_PAIRS = [
  { id: 'red', label: 'Red', color: '#FF0000', emoji: '🍎' },
  { id: 'yellow', label: 'Yellow', color: '#FFD700', emoji: '🍌' },
  { id: 'green', label: 'Green', color: '#00CC00', emoji: '🍃' },
  { id: 'blue', label: 'Blue', color: '#0000FF', emoji: '🔵' },
  { id: 'orange', label: 'Orange', color: '#FFA500', emoji: '🥕' },
  { id: 'purple', label: 'Purple', color: '#800080', emoji: '🍇' },
  { id: 'pink', label: 'Pink', color: '#FF69B4', emoji: '🌸' },
  { id: 'brown', label: 'Brown', color: '#8B4513', emoji: '🪵' },
  { id: 'gray', label: 'Gray', color: '#A9A9A9', emoji: '🪨' },
  { id: 'black', label: 'Black', color: '#000000', emoji: '🕶️' },
  { id: 'white', label: 'White', color: '#FFFFFF', emoji: '🐑' },
  { id: 'cyan', label: 'Cyan', color: '#00FFFF', emoji: '🧊' },
  { id: 'lime', label: 'Lime', color: '#BFFF00', emoji: '🥒' },
  { id: 'gold', label: 'Gold', color: '#FFD700', emoji: '🏅' },
];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function ColorShapeMatchScreen() {
  const [colors, setColors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [round, setRound] = useState(0);
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);
  const [sound, setSound] = useState();

  useEffect(() => {
    const shuffled = shuffle(ALL_PAIRS);
    const selectedSet = shuffled.slice(0, 4 + Math.floor(Math.random() * 2)); // random 4 or 5
    setColors(shuffle(selectedSet));
    const objs = selectedSet.map(({ id, emoji, color }) => ({
      id,
      name: emoji,
      color,
    }));
    setObjects(shuffle(objs));
    setMatchedPairs([]);
    setSelectedColor(null);
    setSelectedObject(null);
  }, [round]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playCorrectSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/amazing.wav'));
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    if (matchedPairs.length === colors.length && colors.length > 0) {
      setTimeout(() => {
        alert('🎉 Awesome! Starting a new round!');
        setRound((r) => r + 1);
      }, 1000);
    }
  }, [matchedPairs]);

  useEffect(() => {
    if (selectedColor && selectedObject) {
      if (selectedColor.id === selectedObject.id) {
        setMatchedPairs((prev) => [...prev, selectedColor.id]);
        scale.value = withSequence(withSpring(1.4), withSpring(1));
        playCorrectSound();
      } else {
        shake.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
        Vibration.vibrate(200);
      }

      setTimeout(() => {
        setSelectedColor(null);
        setSelectedObject(null);
      }, 800);
    }
  }, [selectedColor, selectedObject]);

  const onColorPress = (color) => {
    if (!matchedPairs.includes(color.id)) setSelectedColor(color);
  };

  const onObjectPress = (object) => {
    if (!matchedPairs.includes(object.id)) setSelectedObject(object);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shake.value }],
  }));

  const renderCard = (item, onPress, isColorCard = true) => (
    <TouchableWithoutFeedback onPress={() => onPress(item)}>
      <Animated.View
        style={[
          styles.card,
          isColorCard
            ? { backgroundColor: item.color }
            : { borderColor: item.color, borderWidth: 2 },
          (selectedColor?.id === item.id || selectedObject?.id === item.id) && {
            borderWidth: 4,
            borderColor: '#FFD700',
          },
          matchedPairs.includes(item.id) && {
            borderWidth: 4,
            borderColor: '#00FF00',
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.cardText,
            {
              fontSize: isColorCard ? 22 : 60,
              color: isColorCard && item.color === '#FFFFFF' ? '#000' : '#333',
            },
          ]}
        >
          {isColorCard ? item.label : item.name}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Link href="/memorygames" style={styles.arrowIcon}>
        <Icon name="arrowleft" size={30} color="#000" />
      </Link>

      <Text style={styles.title}>Match the Color to the Object!</Text>

      <View style={styles.matchingContainer}>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Colors</Text>
          {colors.map((item) => renderCard(item, onColorPress, true))}
        </View>
        <View style={styles.column}>
          <Text style={styles.subtitle}>Objects</Text>
          {objects.map((item) => renderCard(item, onObjectPress, false))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#F3E38D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  matchingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    padding: 25,
    margin: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 130,
    backgroundColor: '#fff',
  },
  cardText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrowIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
});
