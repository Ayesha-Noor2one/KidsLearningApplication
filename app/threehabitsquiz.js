import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Habit Quiz";
export default function TalkingMagicFriendFinal() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const faceRotate = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const data = [
    { emoji: "😁🪥", text: "I brush teeth", answer: true },
    { emoji: "🍎", text: "I eat apple", answer: true },
    { emoji: "🍔", text: "I eat junk food", answer: false },
    { emoji: "😴", text: "I sleep early", answer: true },
    { emoji: "📱", text: "I use phone all night", answer: false },
    { emoji: "🚿", text: "I take bath", answer: true },
    { emoji: "🍭", text: "I eat candy all day", answer: false },
    { emoji: "💧", text: "I drink water", answer: true },
    { emoji: "🧼", text: "I wash hands", answer: true },
  ];

  const current = data[index];

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#fff7ed", "#e0f7fa", "#fce7f3"],
  });

 
  useEffect(() => {
    Animated.loop(
      Animated.timing(faceRotate, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = faceRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Speech.stop();
    Speech.speak(current.text, { rate: 0.85 });

    scaleAnim.setValue(1);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.18,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const wrongShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 15,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -15,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const answer = (user) => {
    if (user === current.answer) {
      setCorrect((p) => p + 1);
      Speech.speak("Yay");
    } else {
      setWrong((p) => p + 1);
      Speech.speak("Oops");
      wrongShake();
    }

    setTimeout(() => {
      if (index < data.length - 1) {
        setIndex(index + 1);
      } else {
        saveProgress();
        setShowReward(true);

        Animated.loop(
          Animated.sequence([
            Animated.timing(starAnim, {
              toValue: 1.35,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(starAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, 900);
  };

  const restart = () => {
    setIndex(0);
    setCorrect(0);
    setWrong(0);
    setShowReward(false);
  };

  const exitGame = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/three");
  };

  const Popup = () => (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.popupText}>Exit Game?</Text>

        <View style={styles.popBtns}>
          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "#ff4d6d" }]}
            onPress={() => setShowPopup(false)}
          >
            <Text style={styles.popTxt}>No</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.popBtn, { backgroundColor: "#22c55e" }]}
            onPress={exitGame}
          >
            <Text style={styles.popTxt}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const Back = () => (
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() => setShowPopup(true)}
    >
      <FontAwesome5 name="arrow-left" size={18} color="#fff" />
    </TouchableOpacity>
  );

  if (showReward) {
    return (
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <Back />
        {showPopup && <Popup />}

        <Animated.Text
          style={{ fontSize: 100, transform: [{ scale: starAnim }] }}
        >
          ⭐
        </Animated.Text>

        <Text style={styles.rewardTitle}>🎉⭐ Great Job! 🎉⭐</Text>

        <Text style={styles.score}>
          ✅ {correct}   ❌ {wrong}
        </Text>

        <TouchableOpacity style={styles.playAgain} onPress={restart}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Play Again
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      
      await addQuizResult(kidId, quiz, correct,wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };
  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar hidden />
      <Back />
      {showPopup && <Popup />}

      <Text style={styles.title}>🧸 FIND GOOD/BAD HABITS</Text>

      <Animated.Text
        style={[
          styles.bigEmoji,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim },
            ],
          },
        ]}
      >
        {current.emoji}
      </Animated.Text>

      <Text style={styles.text}>{current.text}</Text>

            <View style={styles.row}>
        <TouchableOpacity onPress={() => answer(true)}>
          <Animated.Text
            style={[styles.face, { transform: [{ rotate }] }]}
          >
            😊
          </Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => answer(false)}>
          <Animated.Text
            style={[styles.face, { transform: [{ rotate }] }]}
          >
            😢
          </Animated.Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.score}>
        ✅ {correct}   ❌ {wrong}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    position: "absolute",
    top: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4d6d",
  },

  bigEmoji: {
    fontSize: 145,
  },

  text: {
    fontSize: 22,
    marginTop: 15,
    textAlign: "center",
    paddingHorizontal: 25,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    marginTop: 50,
    gap: 60,
  },

  face: {
    fontSize: 95,
  },

  score: {
    position: "absolute",
    bottom: 90,
    fontSize: 20,
    fontWeight: "bold",
  },

  rewardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
  },

  playAgain: {
    marginTop: 25,
    backgroundColor: "#FF6F00",
    padding: 14,
    borderRadius: 14,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 18,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 25,
    zIndex: 9999,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    elevation: 100,
  },

  popup: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 22,
    width: "78%",
    alignItems: "center",
  },

  popupText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  popBtns: {
    flexDirection: "row",
    marginTop: 20,
    gap: 15,
  },

  popBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  popTxt: {
    color: "#fff",
    fontWeight: "bold",
  },
});