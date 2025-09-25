import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';


const colors = [
  { name: 'red', code: '#e74c3c' },
  { name: 'yellow', code: '#f1c40f' },
  { name: 'blue', code: '#2980b9' },
  { name: 'green', code: '#27ae60' },
  { name: 'pink', code: '#d35db3' },
  { name: 'purple', code: '#8e44ad' },
  { name: 'white', code: '#ecf0f1' },
  { name: 'orange', code: '#e67e22' },
  { name: 'gray', code: '#95a5a6' },
  { name: 'brown', code: '#8e6e53' },
  { name: 'black', code: '#000000' },
  { name: 'cyan', code: '#00FFFF' },
  { name: 'lime', code: '#00FF00' },
  { name: 'indigo', code: '#4B0082' },
  { name: 'gold', code: '#FFD700' },
];

const TOTAL_QUESTIONS = 10;

export default function GuessColor() {
  const navigation = useNavigation();
  const [currentColor, setCurrentColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [showCongrats, setShowCongrats] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const wrongOptions = colors
      .filter((c) => c.name !== randomColor.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const allOptions = [...wrongOptions, randomColor].sort(() => 0.5 - Math.random());
    setCurrentColor(randomColor);
    setOptions(allOptions);
  };

  const handleAnswer = (option) => {
    if (option.name === currentColor.name) {
      if (questionIndex + 1 === TOTAL_QUESTIONS) {
     
        setShowCongrats(true);
      } else {
       
        setQuestionIndex(questionIndex + 1);
        generateQuestion();
      }
    } else {
     
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleBackPress = () => {
    navigation.navigate('color');
  };

  if (showCongrats) {
    return (
      <ImageBackground source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }}
   style={styles.bg}>
        <SafeAreaView style={styles.container}>
          <LottieView
            source={require('../assets/animations/burst.json')}
            autoPlay
            loop={false}
            style={{ width: 250, height: 250 }}
          />
          <Text style={styles.congratsText}>Congratulations! 🎉</Text>
          <TouchableOpacity
            style={styles.replayBtn}
            onPress={() => {
              setShowCongrats(false);
              setQuestionIndex(0);
              generateQuestion();
            }}
          >
            <Text style={styles.btnText}>Replay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackBtn} onPress={handleBackPress}>
            <Text style={styles.btnText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }}
   style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {currentColor && (
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>Which color is this?</Text>
            <View style={[styles.colorSample, { backgroundColor: currentColor.code }]} />
          </View>
        )}

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.optionsRow}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={[styles.optionBox, { backgroundColor: option.code }]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Text style={styles.progressText}>
          Question {questionIndex + 1} of {TOTAL_QUESTIONS}
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 25,
  },
  questionBox: { alignItems: 'center', marginBottom: 30 },
  questionText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  colorSample: { width: 120, height: 120, borderRadius: 60, marginTop: 15 },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  optionBox: {
    width: 90,
    height: 90,
    margin: 10,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  optionText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' },
  progressText: { marginTop: 20, fontSize: 18, color: 'white' },
  congratsText: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 20 },
  replayBtn: { marginTop: 20, padding: 12, backgroundColor: '#3498db', borderRadius: 10 },
  goBackBtn: { marginTop: 10, padding: 12, backgroundColor: '#e74c3c', borderRadius: 10 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
