import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Modal,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quizName="Word Quiz";

export default function OppositesQuizGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState(null);

  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(1)).current;
  const emojiAnim = useRef(new Animated.Value(1)).current;

  const quiz = [
    { questionIcon: "🐘", question: "BIG", options: ["🐘", "🐜", "🐭"], answer: "🐜" },
    { questionIcon: "🔥", question: "HOT", options: ["🔥", "🧊", "☀️"], answer: "🧊" },
    { questionIcon: "🐆", question: "FAST", options: ["🐢", "🐆", "🚗"], answer: "🐢" },
    { questionIcon: "😄", question: "HAPPY", options: ["😢", "😡", "😄"], answer: "😢" },
    { questionIcon: "🦒", question: "TALL", options: ["🦒", "🐘", "🐈"], answer: "🐈" },
    { questionIcon: "🫙", question: "EMPTY", options: ["🥛", "🫙", "🧃"], answer: "🥛" },
  ];

  const current = quiz[index];


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F3F7FF", "#fbe3edff"],
  });

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(emojiAnim, { toValue: 1.5, useNativeDriver: true }),
        Animated.spring(emojiAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  }, []);

 
  useEffect(() => {
    if (showResult) {
      Animated.loop(
        Animated.sequence([
          Animated.spring(flowerAnim, { toValue: 1.3, useNativeDriver: true }),
          Animated.spring(flowerAnim, { toValue: 1, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [showResult]);

  useEffect(() => {
    Speech.stop();
    Speech.speak(current.question);
  }, [index]);

  const shakeAnim = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animate = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const checkAnswer = (opt) => {
    setSelected(opt);
    animate();

    if (opt === current.answer) {
      setScore(score + 1);
      Speech.speak("Correct!");
    } else {
      setWrong(wrong + 1);
      Speech.speak("Wrong!");
      shakeAnim();
    }

    setTimeout(() => {
      if (index < quiz.length - 1) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        saveProgress()
        setShowResult(true);
      }
    }, 600);
  };

  const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      
      await addQuizResult(kidId, quizName, score,wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setWrong(0);
    setShowResult(false);
    setSelected(null);
  };

 
  const Popup = () => (
    <Modal transparent visible={showPopup} animationType="fade">
      <View style={styles.popupOverlay}>
        <View style={styles.popupBox}>
          <Text style={{ fontSize: 18, marginBottom: 15 }}>Exit Game?</Text>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              style={[styles.popBtn, { backgroundColor: "#FF5252" }]}
              onPress={() => setShowPopup(false)}
            >
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => router.push("/five")}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

 
  if (showResult) {
    return (
      <View style={[styles.container, { backgroundColor: "#FFF7E0" }]}>
        
      
        <Animated.Text
          style={{
            fontSize: 140,
            marginTop:50,
            transform: [{ scale: flowerAnim }],
          }}
        >
         🌺
        </Animated.Text>

       
        <Text style={styles.title}>🎉 GREAT JOB 🎉</Text>

       
        <View style={styles.bottomScore}>
          <Text style={styles.bottomText}>✔ {score}</Text>
          <Text style={styles.bottomText}>❌ {wrong}</Text>
        </View>

       
        <TouchableOpacity style={styles.btn} onPress={restart}>
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

       
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setShowPopup(true)}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Popup />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar />

      <Text style={styles.headerTitle}>🌈 OPPOSITES GAME 🌈</Text>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setShowPopup(true)}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Popup />

    
      <Text style={styles.hint}>
        Opposite of {current.question} is?
      </Text>

     
      <Animated.Text
        style={{
          fontSize: 150,
          transform: [{ scale: emojiAnim }],
        }}
      >
        {current.questionIcon}
      </Animated.Text>

     
      <Animated.View style={{ transform: [{ scale }, { translateX: shake }] }}>
        <View style={styles.optionRow}>
          {current.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                selected === opt && opt === current.answer && { backgroundColor: "#4CAF50" },
                selected === opt && opt !== current.answer && { backgroundColor: "#FF5252" },
              ]}
              onPress={() => checkAnswer(opt)}
              disabled={selected !== null}
            >
              <Text style={{ fontSize: 40 }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

     
      <View style={styles.bottomScore}>
        <Text style={styles.bottomText}>✔ {score}</Text>
        <Text style={styles.bottomText}>❌ {wrong}</Text>
      </View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  headerTitle: {
    position: "absolute",
    top: 70,
    fontSize: 26,
    fontWeight: "bold",
    color: "#a09a2bff",
  },
  title: {
  position: "absolute",
  top: 200,  
  fontSize: 26,
  fontWeight: "bold",
  color: "#a09a2bff",
},

  hint: {
    fontSize: 20,
    marginBottom: 10,
    color: "#555",
  },

  optionRow: {
    flexDirection: "row",
    gap: 15,
  },

  option: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    elevation: 5,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  bottomScore: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
    alignItems: "center",
  },

  bottomText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 25,
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },

  popBtn: {
    padding: 10,
    borderRadius: 8,
    width: 60,
    alignItems: "center",
  },
});