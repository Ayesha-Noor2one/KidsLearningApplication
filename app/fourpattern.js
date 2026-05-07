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
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Pattern Quiz";

export default function PatternGame() {
  const router = useRouter();

  const [pattern, setPattern] = useState([]);
  const [options, setOptions] = useState([]);
  const [correct, setCorrect] = useState(null);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [level, setLevel] = useState(1);
  const [finished, setFinished] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 4000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 4000, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bottomAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(bottomAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF3C7", "#D0F4FF"],
  });

  const bottomMove = bottomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  
  useEffect(() => {
    generatePattern();

    scaleAnim.setValue(0.7);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [level]);

  const generatePattern = () => {
    let start = Math.floor(Math.random() * 5) + 1;

    let length = Math.floor(Math.random() * 3) + 2;

    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(start + i);
    }

    const blankPos = Math.floor(Math.random() * length);
    const correctAns = arr[blankPos];

    let temp = [...arr];
    temp[blankPos] = "?";

    let opts = [correctAns];

    while (opts.length < 3) {
      let rand = correctAns + Math.floor(Math.random() * 4) - 2;
      if (!opts.includes(rand) && rand > 0) {
        opts.push(rand);
      }
    }

    opts.sort(() => Math.random() - 0.5);

    setPattern(temp);
    setOptions(opts);
    setCorrect(correctAns);

    Speech.stop();
    Speech.speak("Find the missing number");
  };

  
  useEffect(() => {
    if (finished) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(heartAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [finished]);


  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      
      await addQuizResult(kidId, quiz, right,wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };
  const onPress = (num) => {
    if (num === correct) {
      Speech.speak("Good job");
      setRight((r) => r + 1);

      if (level >= 10) {
        saveProgress();
        setFinished(true); 
      } else {
        setTimeout(() => setLevel((l) => l + 1), 200);
      }
    } else {
      Speech.speak("Try again");
      setWrong((w) => w + 1);
      shake();
    }
  };

  
  if (finished) {
    return (
      <View style={styles.reward}>
        

        <Text style={styles.title}>🎉 Congrats 🎉</Text>

        <Animated.Text
          style={{ fontSize: 90, transform: [{ scale: heartAnim }] }}
        >
          💚
        </Animated.Text>

        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setFinished(false);
            setLevel(1);
            setRight(0);
            setWrong(0);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🌈 Pattern Game 🧠</Text>
      <Text style={styles.hint}>Find the missing number</Text>

      <Animated.View
        style={{
          flexDirection: "row",
          marginVertical: 40,
          transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
        }}
      >
        {pattern.map((item, index) => (
          <View
            key={index}
            style={[styles.box, { backgroundColor: COLORS[index % COLORS.length] }]}
          >
            <Text style={styles.number}>{item}</Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.optionBtn, { backgroundColor: COLORS[(i + 2) % COLORS.length] }]}
            onPress={() => onPress(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.score, { transform: [{ translateY: bottomMove }] }]}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
        <Text>Level {level}</Text>
      </Animated.View>

      <Popup show={showPopup} close={() => setShowPopup(false)} router={router} />
    </Animated.View>
  );
}


const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9D4EDD"];


function Popup({ show, close, router }) {
  return (
    <Modal transparent visible={show}>
      <View style={styles.popup}>
        <View style={styles.popupBox}>
          <Text>Exit Game?</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={close}>
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "green" }]}
              onPress={() => router.push("/four")}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 30, fontWeight: "bold", color: "#FF6B6B", position: "absolute", top: 80 },

  hint: { fontSize: 18, position: "absolute", top: 120 },

  box: {
    width: 75,
    height: 75,
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  number: { fontSize: 28, fontWeight: "bold", color: "#fff" },

  options: { flexDirection: "row" },

  optionBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },

  optionText: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  score: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    gap: 20,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 20,
  },

  reward: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  playBtn: {
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  popup: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },

  btn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});