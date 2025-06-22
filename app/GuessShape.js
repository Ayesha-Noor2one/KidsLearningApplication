import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Define shapes with image assets
const ALL_SHAPES = [
  { name: 'Circle', image: require('../assets/images/circle.png') },
  { name: 'Square', image: require('../assets/images/sq.png') },
  { name: 'Rectangle', image: require('../assets/images/rec.png') },
  { name: 'Triangle', image: require('../assets/images/tr.png') },
  { name: 'Star', image: require('../assets/images/str.png') },
  { name: 'Oval', image: require('../assets/images/Ova.png') },
  { name: 'Pentagon', image: require('../assets/images/pen.png') },
  { name: 'Hexagon', image: require('../assets/images/hexa.png') },
  { 
    name: 'Heart', 
    image: require('../assets/images/heart.png'), 
  },
];
const TOTAL_OPTIONS = 3;

export default function ShapeMatchGame() {
  const [remaining, setRemaining] = useState([...ALL_SHAPES]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [showBurst, setShowBurst] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const generateQuestion = () => {
    if (remaining.length === 0) return;
    const idx = Math.floor(Math.random() * remaining.length);
    const shape = remaining[idx];
    const wrongOpts = ALL_SHAPES
      .filter((s) => s.name !== shape.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, TOTAL_OPTIONS - 1)
      .map((s) => s.name);
    const allOpts = [...wrongOpts, shape.name].sort(() => 0.5 - Math.random());
    setCurrent(shape);
    setOptions(allOpts);
  };

  useEffect(() => {
    generateQuestion();
  }, [remaining]);

  const shake = () => Animated.sequence([
    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 6, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: -6, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();

  const handleAnswer = (selected) => {
    if (!current) return;
    if (selected === current.name) {
      setShowBurst(true);
      setTimeout(() => {
        setShowBurst(false);
        setRemaining((prev) => prev.filter((s) => s.name !== current.name));
      }, 800);
    } else {
      shake();
    }
  };

  const answeredCount = ALL_SHAPES.length - remaining.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Which shape is this?</Text>
      <Text style={styles.counter}>{answeredCount + 1} / {ALL_SHAPES.length}</Text>

      {current && (
        <View style={styles.imageContainer}>
          <Image source={current.image} style={styles.image} />
        </View>
      )}

      <Animated.View style={[
        styles.optionsContainer,
        { transform: [{ translateX: shakeAnimation }] }
      ]}>
        {options.map((opt, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.optionButton,
              { backgroundColor: getColorByIndex(i) },
              pressed && styles.pressed
            ]}
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        ))}
      </Animated.View>

      {showBurst && (
        <LottieView
          source={require('../assets/animations/burst.json')}
          autoPlay
          loop={false}
          style={styles.burst}
        />
      )}

      {remaining.length === 0 && (
        <Text style={styles.completeText}>🎉 You matched all shapes!</Text>
      )}
    </View>
  );
}

const getColorByIndex = (index) => {
  const colors = ['#FFB6C1', '#87CEFA', '#90EE90', '#FFD700'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9EC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444'
  },
  counter: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  imageContainer: {
    marginBottom: 40,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  optionsContainer: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  optionButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  pressed: {
    opacity: 0.7
  },
  burst: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '30%'
  },
  completeText: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745'
  }
});
