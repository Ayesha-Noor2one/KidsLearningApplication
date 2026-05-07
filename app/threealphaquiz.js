import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Alphabets Quiz";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");



export default function AlphabetTapGame() {
  const router = useRouter();

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);

  const [level, setLevel] = useState(1);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [options, setOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);

 
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStar, setShowStar] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const mainBounce = useRef(new Animated.Value(1)).current;

  const starAnim = useRef(new Animated.Value(0)).current; 

  const optionAnimMap = useRef({}).current;

  const currentLetter = queue[index];

  useEffect(() => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF3C7", "#D7F9FF"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!currentLetter) return;

    const count = 4 + level;

    const wrongLetters = LETTERS
      .filter((l) => l !== currentLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, count - 1);

    const arr = [...wrongLetters, currentLetter].sort(
      () => Math.random() - 0.5
    );

    setOptions(arr);

    Speech.stop();
    Speech.speak(`Find letter ${currentLetter}`);
  }, [index, level, queue]);

  const bounce = (anim) => {
    anim.setValue(1);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

 
  const runStarAnimation = (callback) => {
    setShowStar(true);
    setIsAnimating(true);

    starAnim.setValue(0);

    Animated.sequence([
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(starAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowStar(false);
      setIsAnimating(false);
      callback(); 
    });
  };

  const onPressLetter =  (l) => {
    if (isAnimating) return; 

    const anim = optionAnimMap[l] || mainBounce;
    console.log("letter is " +l);

    
    if (l === currentLetter) {
      Speech.speak("Good job!");

      setRight((r) => {
        const newR = r + 1;
        if (newR % 5 === 0) setLevel((lv) => lv + 1);
        return newR;
      });

      bounce(anim);
      
      runStarAnimation(() => {
        
        if (index + 1 >= queue.length) {
           saveProgress(); 
          setFinished(true);
        } else {
          setIndex((p) => p + 1);
        }
      });
console.log("ONEssdf");
    } else {
      Speech.speak("Try again");
      setWrong((w) => w + 1);
    }
  };

  const exitToMenu = () => {
    Speech.stop();
    setShowPopup(false);
    router.push("/three");
  };

  if (finished) {
    return (
      <View style={styles.rewardContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/three")}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.rewardTitle}>🎉 Great Job!</Text>

        <Text style={styles.rewardText}>✔ Right: {right}</Text>
        <Text style={styles.rewardText}>❌ Wrong: {wrong}</Text>
        <Text style={styles.rewardText}>⭐ Level: {level}</Text>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
            setQueue(shuffled);
            setIndex(0);
            setRight(0);
            setWrong(0);
            setLevel(1);
            setFinished(false);
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

     
      {showStar && (
        <Animated.View
          style={[
            styles.starOverlay,
            {
              transform: [
                {
                  scale: starAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.8],
                  }),
                },
                {
                  rotate: starAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={{ fontSize: 80 }}>⭐</Text>
        </Animated.View>
      )}

     
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      
      {showPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Exit Game?</Text>

            <View style={styles.popupRow}>
              <TouchableOpacity
                style={[styles.popBtn, { backgroundColor: "#ff4d4d" }]}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.popText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popBtn, { backgroundColor: "#4caf50" }]}
                onPress={exitToMenu}
              >
                <Text style={styles.popText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.title}>🌈 Find Letter 🌈</Text>

      <Animated.Text
        style={[
          styles.target,
          { transform: [{ translateY: floatAnim }, { scale: mainBounce }] },
        ]}
      >
        {currentLetter}
      </Animated.Text>

      <View style={styles.grid}>
        {options.map((l, i) => {
          if (!optionAnimMap[l]) optionAnimMap[l] = new Animated.Value(1);

          return (
            <TouchableOpacity key={i} onPress={() => onPressLetter(l)}>
              <Animated.View
                style={[
                  styles.box,
                  {
                    backgroundColor: `hsl(${i * 32}, 85%, 70%)`,
                    transform: [{ scale: optionAnimMap[l] }],
                  },
                ]}
              >
                <Text style={styles.boxText}>{l}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.stats}>
        <Text style={{ color: "green", fontWeight: "bold" }}>✔ {right}</Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>❌ {wrong}</Text>
        <Text style={{ fontWeight: "bold" }}>⭐ {level}</Text>
      </View>
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
    fontSize: 28,
    fontWeight: "bold",
    position: "absolute",
    top: 60,
    color: "#6A1B9A",
  },

  target: {
    fontSize: 90,
    fontWeight: "bold",
    color: "#ff6f61",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 30,
    gap: 10,
  },

  box: {
    width: 65,
    height: 65,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  boxText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  stats: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    gap: 30,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#00000070",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popupBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  popupRow: {
    flexDirection: "row",
    gap: 15,
  },

  popBtn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  popText: {
    color: "#fff",
    fontWeight: "bold",
  },

  rewardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },

  rewardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  rewardText: {
    fontSize: 18,
    marginTop: 10,
  },

  restartBtn: {
    marginTop: 30,
    backgroundColor: "#ff4081",
    padding: 12,
    borderRadius: 20,
  },

  starOverlay: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
});