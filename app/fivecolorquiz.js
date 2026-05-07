import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Modal,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import * as Speech from "expo-speech";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addQuizResult } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quiz="Color Quiz";

const { width } = Dimensions.get("window");


const COLORS = [
  { name: "Yellow", color: "#FFD700", key: "yellow" },
  { name: "Red", color: "#FF4D4D", key: "red" },
  { name: "Blue", color: "#4DA6FF", key: "blue" },
  { name: "Green", color: "#2ecc71", key: "green" },
  { name: "Orange", color: "#FF8C00", key: "orange" },
];


const EMOJIS = [
  { emoji: "🍌", color: "yellow" },
  { emoji: "⭐", color: "yellow" },
  { emoji: "🌼", color: "yellow" },

  { emoji: "🍎", color: "red" },
  { emoji: "🚗", color: "red" },
  { emoji: "🎈", color: "red" },

  { emoji: "🐟", color: "blue" },
  { emoji: "💧", color: "blue" },

  { emoji: "🌿", color: "green" },
  { emoji: "🥦", color: "green" },

  { emoji: "🍊", color: "orange" },
];

export default function ColorDragGame() {
  const router = useRouter();

  const [target, setTarget] = useState(COLORS[0]);
  const [items, setItems] = useState([]);
  const [collected, setCollected] = useState([]);
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  const [round, setRound] = useState(1);
  const MAX_ROUNDS = 10;

  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(1)).current;
  const itemRefs = useRef({});


  useEffect(() => {
    if (gameOver) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flowerAnim, {
            toValue: 1.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(flowerAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [gameOver]);

  useEffect(() => {
    newRound();
  }, []);

  const randomItems = (targetKey) => {
    const correct = EMOJIS.filter((e) => e.color === targetKey);

    const mixed = [
      ...correct.slice(0, 2),
      ...EMOJIS.sort(() => Math.random() - 0.5).slice(0, 6),
    ];

    return mixed
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({
        id: i + "_" + Math.random(),
        ...item,
        collected: false,
      }));
  };

  const newRound = () => {
    const random = COLORS[Math.floor(Math.random() * COLORS.length)];

    setTarget(random);
    setItems(randomItems(random.key));
    setCollected([]);

    Speech.speak(`Put ${random.name} items in the box`);
  };

  const nextRound = () => {
    if (round >= MAX_ROUNDS) {
      saveProgress();
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setTimeout(newRound, 300);
  };

  const saveProgress = async () => {
      console.log('saveprogress ..............');
      
      const kidId = await AsyncStorage.getItem('kidId');
      console.log(kidId);
      console.log(quiz);
      console.log(score.right);
      console.log(score.wrong);
      
      
      await addQuizResult(kidId, quiz, score.right,score.wrong);
      console.log('completed');
      
      showCompletedMessage();
  };

  const showCompletedMessage = () => {
    Alert.alert('Congratulations!', 'You have learned all the numbers!');
  };

  const resetItem = (id) => {
    if (itemRefs.current[id]) {
      itemRefs.current[id].pos.setValue({ x: 0, y: 0 });
    }
  };

  const onDrop = (item) => {
    const isCorrect = item.color === target.key;

    if (isCorrect) {
      setCollected((p) => [...p, item.emoji]);

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, collected: true } : it
        )
      );

      setScore((s) => ({ ...s, right: s.right + 1 }));

      const remaining = items.filter(
        (i) => i.color === target.key && !i.collected
      );

      if (remaining.length <= 1) nextRound();
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));

      resetItem(item.id);

      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Speech.speak("Try again!");
    }
  };

  const DraggableItem = ({ item }) => {
    const pos = useRef(new Animated.ValueXY()).current;
    itemRefs.current[item.id] = { pos };

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: pos.x, translationY: pos.y } }],
      { useNativeDriver: false }
    );

    const onHandlerStateChange = (e) => {
      if (e.nativeEvent.state === State.END) {
        onDrop(item);
      }
    };

    if (item.collected) return null;

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.item,
            { transform: [...pos.getTranslateTransform(), { translateX: shakeAnim }] },
          ]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const Popup = () => (
    <Modal transparent visible={showPopup}>
      <View style={styles.popup}>
        <View style={styles.popupBox}>
          <Text>Exit Game?</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => setShowPopup(false)}
              style={[styles.btn, { backgroundColor: "red" }]}
            >
              <Text style={{ color: "#fff" }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/five")}
              style={[styles.btn, { backgroundColor: "green" }]}
            >
              <Text style={{ color: "#fff" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

 
  if (gameOver) {
    return (
      <View style={styles.result}>

       
        <TouchableOpacity
          style={styles.back}
          onPress={() => setShowPopup(true)}
        >
          <FontAwesome5 name="arrow-left" color="#fff" />
        </TouchableOpacity>

     
        <Animated.Text
          style={[
            styles.flower,
            { transform: [{ scale: flowerAnim }] },
          ]}
        >
          🌸
        </Animated.Text>

        <Text style={styles.scoreText}>
          ✔ {score.right}   ❌ {score.wrong}
        </Text>

        <TouchableOpacity
          style={styles.play}
          onPress={() => {
            setScore({ right: 0, wrong: 0 });
            setRound(1);
            setGameOver(false);
            newRound();
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
     

        </TouchableOpacity>

        <Popup />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.back}
        onPress={() => setShowPopup(true)}
      >
        <FontAwesome5 name="arrow-left" color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>
        🎨 COLOR GAME (Round {round})
      </Text>

      <View style={[styles.target, { backgroundColor: target.color }]}>
        <Text style={{ color: "#fff" }}>
          Drop {target.name}
        </Text>

        <View style={styles.collectBox}>
          {collected.map((c, i) => (
            <Text key={i} style={{ fontSize: 26 }}>{c}</Text>
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.bottomScore}>
        <Text>✔ {score.right}</Text>
        <Text>❌ {score.wrong}</Text>
      </View>

      <Popup />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#f7f9ff" },
  title: { fontSize: 20, marginTop: 50, fontWeight: "bold", color: "#615ce7ff" },

  target: {
    width: width * 0.8,
    height: 150,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  collectBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 40,
  },

  item: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: { fontSize: 35 },

  bottomScore: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    gap: 20,
  },

  back: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 25,
  },

  result: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flower: {
    fontSize: 160,
    marginBottom: 20,
  },

  scoreText: {
    fontSize: 18,
    marginBottom: 20,
  },

  play: {
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  popup: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  btn: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});