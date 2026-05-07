import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Fruit Quiz";


const DATA = [
  { id: 1, name: "Apple", emoji: "🍎", color: "#FF6B6B" },
  { id: 2, name: "Banana", emoji: "🍌", color: "#FFD93D" },
  { id: 3, name: "Carrot", emoji: "🥕", color: "#FF8C42" },
  { id: 4, name: "Tomato", emoji: "🍅", color: "#FF4D4D" },
  { id: 5, name: "Grapes", emoji: "🍇", color: "#9D4EDD" },
  { id: 6, name: "Broccoli", emoji: "🥦", color: "#4CAF50" },
  { id: 7, name: "Orange", emoji: "🍊", color: "#FF922B" },
  { id: 8, name: "Cucumber", emoji: "🥒", color: "#2ECC71" },
];

export default function KidsCreativeQuiz() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(null);

  const [level, setLevel] = useState(1);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [locked, setLocked] = useState(true);
  const [popup, setPopup] = useState(false);
  const [finished, setFinished] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const rewardStar = useRef(new Animated.Value(0)).current;

  const bg = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  const getCount = () => (level < 3 ? 2 : level < 6 ? 3 : 4);


  useEffect(() => {
    Animated.loop(
      Animated.timing(bg, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const bgColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF7D6", "#E6F7FF"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF6B6B", "#6C5CE7"],
  });

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rewardStar, { toValue: -20, duration: 800, useNativeDriver: true }),
        Animated.timing(rewardStar, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

 
  const generateRound = () => {
    setLocked(true);

    const count = getCount();
    const shuffled = [...DATA].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    const correct = selected[Math.floor(Math.random() * selected.length)];

    setItems(selected);
    setTarget(correct);

    zoomAnim.setValue(0.6);
    Animated.spring(zoomAnim, { toValue: 1.2, useNativeDriver: true }).start(() => {
      Animated.spring(zoomAnim, { toValue: 1, useNativeDriver: true }).start();
    });

    Speech.stop();
    setTimeout(() => Speech.speak(`Find ${correct.name}`), 500);

    setTimeout(() => setLocked(false), 2000);
  };

  useEffect(() => {
    generateRound();
  }, [level]);

  
  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

 
  const star = () => {
    starAnim.stopAnimation();   
    starAnim.setValue(0);

    Animated.parallel([
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(starAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const onPress = (item) => {
    if (locked || !target) return;

    setLocked(true);

    if (item.id === target.id) {
      Speech.speak("Good job!");
      setRight((r) => r + 1);
      star();

      setTimeout(() => {
        if (level >= 10) {
          saveProgress()
          setFinished(true);}
        else setLevel((l) => l + 1);
        setLocked(false);
      }, 800);
    } else {
      Speech.speak("Try again");
      setWrong((w) => w + 1);
      shake();
      setTimeout(() => setLocked(false), 400);
    }
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
  
  if (finished) {
    return (
      <Animated.View style={[styles.finish, { backgroundColor: bgColor }]}>

        <TouchableOpacity style={styles.backBtn} onPress={() => setPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <Popup show={popup} close={() => setPopup(false)} router={router} />

        <Text style={{ fontSize: 28 }}>🎉 Amazing!</Text>

        <Animated.Text
          style={{
            fontSize: 120,
            marginVertical: 20,
            transform: [{ translateY: rewardStar }],
          }}
        >
          ⭐
        </Animated.Text>

        <Text>✔ Right: {right}</Text>
        <Text>❌ Wrong: {wrong}</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setLevel(1);
            setRight(0);
            setWrong(0);
            setFinished(false);
            generateRound();
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>

      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.Text style={[styles.title, { color: titleColor }]}>
        👂 Listen & Find
      </Animated.Text>

      <TouchableOpacity style={styles.backBtn} onPress={() => setPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Popup show={popup} close={() => setPopup(false)} router={router} />

      <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: zoomAnim }] }]}>
        {target?.emoji || "❓"}
      </Animated.Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => onPress(item)} disabled={locked}>
              <View style={styles.box}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.star,
          {
            opacity: starAnim,
            transform: [
              {
                scale: starAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1.4],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: 70 }}>⭐</Text>
      </Animated.View>

      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
        <Text>Level {level}</Text>
      </View>
    </Animated.View>
  );
}


function Popup({ show, close, router }) {
  return (
    <Modal transparent visible={show}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text>Exit Game?</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity style={[styles.popBtn, { backgroundColor: "red" }]} onPress={close}>
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popBtn, { backgroundColor: "green" }]}
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
  title: { fontSize: 26, fontWeight: "bold", position: "absolute", top: 60 },
  bigEmoji: { fontSize: 120, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  box: {
    width: 95,
    height: 95,
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },
  emoji: { fontSize: 45 },
  score: { position: "absolute", bottom: 30, flexDirection: "row", gap: 20 },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: { backgroundColor: "#fff", padding: 25, borderRadius: 20 },
  popBtn: { padding: 10, marginHorizontal: 10, borderRadius: 10 },
  star: { position: "absolute", top: "40%", alignSelf: "center" },
  btn: {
    marginTop: 20,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 15,
  },
  finish: { flex: 1, justifyContent: "center", alignItems: "center" },
});