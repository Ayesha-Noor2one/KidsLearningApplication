import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";


const items = [
  { emoji: "🍎", word: "APPLE" },
  { emoji: "🐶", word: "DOG" },
  { emoji: "🐱", word: "CAT" },
  { emoji: "🚗", word: "CAR" },
  { emoji: "🐟", word: "FISH" },
];

export default function ScrambledWordsGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [exitPopup, setExitPopup] = useState(false);
  const [rewardPopup, setRewardPopup] = useState(false);
  const [locked, setLocked] = useState(true);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;

  const [shuffled, setShuffled] = useState([]);
  const [showCorrect, setShowCorrect] = useState(false);

  const animRefs = useRef([]);

  const current = items[index];
  const letters = current.word.split("");


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 2,
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
    inputRange: [0, 1, 2],
    outputRange: ["#D7F9FF", "#FFF3C7", "#E5FFE5"],
  });

 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  
  useEffect(() => {
    emojiAnim.setValue(0);
    Animated.spring(emojiAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [index]);

 
  const shuffle = (arr) => {
    let a = arr.slice();
    while (a.join("") === arr.join("")) {
      a = a.sort(() => Math.random() - 0.5);
    }
    return a;
  };


  const start = () => {
    setLocked(true);
    setShowCorrect(false);
    Speech.stop();

    const refs = letters.map(() => new Animated.Value(0));
    animRefs.current = refs;

    setShuffled(shuffle([...letters]));

    Speech.speak(`Let's spell ${current.word}`, {
      rate: 0.8,
      onDone: () => {
        Animated.stagger(
          120,
          refs.map((ref) =>
            Animated.timing(ref, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.bounce),
              useNativeDriver: true,
            })
          )
        ).start(() => {
          setShowCorrect(true);

          Speech.speak(letters.join(" "), {
            rate: 0.9,
            onDone: () => setTimeout(() => setLocked(false), 400),
          });
        });
      },
    });
  };

  useEffect(() => {
    start();
  }, [index]);

  const next = () => {
    if (locked) return;
    if (index === items.length - 1) setRewardPopup(true);
    else setIndex(index + 1);
  };

  const prev = () => {
    if (locked) return;
    if (index > 0) setIndex(index - 1);
  };

  const exitYes = () => {
    setExitPopup(false);
    router.push("/five");
  };

  const exitNo = () => setExitPopup(false);

  const Overlay = () => (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={{ marginBottom: 10 }}>Exit Game?</Text>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.noBtn} onPress={exitNo}>
            <Text style={{ color: "#fff" }}>NO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.yesBtn} onPress={exitYes}>
            <Text style={{ color: "#fff" }}>YES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

 
  if (rewardPopup) {
    return (
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <TouchableOpacity style={styles.back} onPress={() => setExitPopup(true)}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        {exitPopup && <Overlay />}

        <Animated.Text
          style={[
            styles.trophy,
            {
              transform: [
                { translateY: floatAnim },
                {
                  scale: emojiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
        >
          🏆
        </Animated.Text>

        <Text style={styles.rewardText}>Good Job!</Text>

        <TouchableOpacity
          style={styles.playAgain}
          onPress={() => {
            setIndex(0);
            setRewardPopup(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Play Again</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.back} onPress={() => setExitPopup(true)}>
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {exitPopup && <Overlay />}

      <Text style={styles.title}>Spell & Learn</Text>

      <Animated.Text
        style={[
          styles.emoji,
          {
            transform: [
              { translateY: floatAnim },
              {
                scale: emojiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          },
        ]}
      >
        {current.emoji}
      </Animated.Text>

           <View style={styles.row}>
        {shuffled.map((l, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.text}>{l}</Text>
          </View>
        ))}
        <Text style={styles.cross}>❌</Text>
      </View>

     
      {showCorrect && (
        <View style={styles.row}>
          {letters.map((l, i) => {
            const anim = animRefs.current[i];
            return (
              <Animated.View
                key={i}
                style={[
                  styles.correct,
                  {
                    opacity: anim || 1,
                    transform: [
                      {
                        translateY: anim
                          ? anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-40, 0],
                            })
                          : 0,
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.text}>{l}</Text>
              </Animated.View>
            );
          })}
          <Text style={styles.tick}>✔️</Text>
        </View>
      )}

      <View style={styles.nav}>
        <TouchableOpacity onPress={prev} style={styles.btn}>
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={next}
          style={[styles.btn, { opacity: locked ? 0.3 : 1 }]}
        >
          <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", position: "absolute", top: 60, color: "#ff9710ff"},
  emoji: { fontSize: 160, marginBottom: 20 },
  trophy: { fontSize: 120 },
  row: { flexDirection: "row", alignItems: "center" },

  card: {
    margin: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  correct: {
    margin: 10,
    padding: 15,
    backgroundColor: "#1cf590",
    borderRadius: 12,
  },

  text: { fontSize: 22, fontWeight: "bold" },

  cross: { marginLeft: 10, fontSize: 18 },
  tick: { marginLeft: 10, fontSize: 18 },

  nav: {
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
  },

  btn: {
    backgroundColor: "#00000055",
    padding: 12,
    borderRadius: 30,
    marginHorizontal: 20,
  },

  back: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  noBtn: {
    backgroundColor: "red",
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },

  yesBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },

  rewardText: { fontSize: 30, fontWeight: "bold" },

  playAgain: {
    marginTop: 20,
    backgroundColor: "#FF6F00",
    padding: 12,
    borderRadius: 10,
  },
});