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

export default function BodyPartsGame() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);
  const [canTap, setCanTap] = useState(false);
  const [speechDone, setSpeechDone] = useState(true);

  const mountedRef = useRef(true);
  const lock = useRef(false);
  const speakId = useRef(0);

  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const parts = [
    { name: "HEAD", emoji: "👦" },
    { name: "EYES", emoji: "👀" },
    { name: "EAR", emoji: "👂" },
    { name: "NOSE", emoji: "👃" },
    { name: "LIPS", emoji: "👄" },
    { name: "HAND", emoji: "✋" },
    { name: "ARM", emoji: "💪" },
    { name: "LEG", emoji: "🦵" },
    { name: "FOOT", emoji: "🦶" },
  ];

  const current = parts[index] || parts[0];

  const letterAnims = useRef(
    current.name.split("").map(() => new Animated.Value(1))
  ).current;

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#D7F9FF", "#FFE5E5", "#E5FFE5"],
  });

 
  const safeStop = () => {
    try {
      Speech.stop();
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      safeStop();
    };
  }, []);

  const bounce = (i) => {
    Animated.sequence([
      Animated.timing(letterAnims[i], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(letterAnims[i], { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

 
  const speak = () => {
    if (lock.current || !mountedRef.current) return;

    const mySpeakId = ++speakId.current;

    lock.current = true;
    setCanTap(false);
    setSpeechDone(false);

    safeStop();

    const letters = current.name.split("");
    let i = 0;

    setTimeout(() => {
      Speech.speak(current.name, {
        onDone: () => {
          const playLetter = () => {
            if (!mountedRef.current) return;
            if (mySpeakId !== speakId.current) return; 

            if (i >= letters.length) {
              lock.current = false;
              setCanTap(true);
              setSpeechDone(true);
              return;
            }

            const l = letters[i];
            bounce(i);

            Speech.speak(l, {
              onDone: () => {
                i++;
                setTimeout(playLetter, 250);
              },
            });
          };

          playLetter();
        },
      });
    }, 300);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      speak();
    }, 400);

    return () => clearTimeout(t);
  }, [index]);

  const tapLetter = (l, i) => {
    if (!canTap) return;
    bounce(i);
    safeStop();
    setTimeout(() => Speech.speak(l), 50);
  };

  const next = () => {
    if (!speechDone) return;
    if (index === parts.length - 1) setFinished(true);
    else setIndex((p) => p + 1);
  };

  const prev = () => {
    if (!speechDone) return;
    if (index > 0) setIndex((p) => p - 1);
  };

  const exit = () => {
    safeStop();
    setShowPopup(false);
    router.push("/four");
  };
if (finished) {
  return (
    <View style={styles.reward}>
      
     
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setShowPopup(true)}
      >
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      <Animated.Text
        style={[styles.heart, { transform: [{ scale: heartAnim }] }]}
      >
        🖤
      </Animated.Text>

      <Text style={{ fontSize: 35 }}>🎉 GOOD JOB 🎉</Text>

      <TouchableOpacity
        style={styles.playAgain}
        onPress={() => {
          setIndex(0);
          setFinished(false);
        }}
      >
        <Text style={{ color: "#fff" }}>Play Again</Text>
      </TouchableOpacity>

     
      <Modal transparent visible={showPopup} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Exit Game?
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.no}
                onPress={() => setShowPopup(false)}
              >
                <Text style={{ color: "#fff" }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.yes}
                onPress={() => {
                  setShowPopup(false);
                  router.push("/four");
                }}
              >
                <Text style={{ color: "#fff" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => setShowPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

     
      <Modal transparent visible={showPopup} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Exit Game?</Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.no} onPress={() => setShowPopup(false)}>
                <Text style={{ color: "#fff" }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.yes} onPress={exit}>
                <Text style={{ color: "#fff" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>✨PARTS OF BODY ✨</Text>

      <Animated.Text style={[styles.emoji, { transform: [{ translateY: floatAnim }] }]}>
        {current.emoji}
      </Animated.Text>

      <Text style={styles.word}>{current.name}</Text>

      <View style={styles.row}>
        {current.name.split("").map((l, i) => (
          <TouchableOpacity key={i} onPress={() => tapLetter(l, i)}>
            <Animated.View
              style={[
                styles.box,
                {
                  transform: [{ scale: letterAnims[i] || 1 }],
                  backgroundColor: `hsl(${i * 60}, 80%, 60%)`,
                },
              ]}
            >
              <Text style={styles.letter}>{l}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity onPress={prev} style={styles.navBtn}>
          <FontAwesome name="chevron-left" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={next} style={styles.navBtn}>
          <FontAwesome name="chevron-right" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: 
  { flex: 1,
     justifyContent: "center",
      alignItems: "center" },
  title:
   { fontSize: 28,
     fontWeight: "bold",
      position: "absolute", 
      top: 60,
       color: "#FF6B6B" },
  emoji:
   { fontSize: 120 },
  word: 
  { fontSize: 32,
     fontWeight: "bold",
      marginTop: 10 },
  row: 
  { flexDirection: "row", marginTop: 15 },
  box: 
  { margin: 4, padding: 12, borderRadius: 10 },
  letter: 
  { color: "#fff", fontSize: 22, fontWeight: "bold" },
  nav: 
  { flexDirection: "row", position: "absolute", bottom: 60, gap: 30 },
  navBtn:
   { backgroundColor: "#00000088", padding: 14, borderRadius: 50 },
  backBtn:
   { position: "absolute", top: 40, left: 15, backgroundColor: "#FF6B6B", padding: 10, borderRadius: 20 },
  overlay: 
  { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  popup: 
  { backgroundColor: "#fff", padding: 20, borderRadius: 15 },
  no:
   { backgroundColor: "red", padding: 10, marginRight: 10 },
  yes:
  { backgroundColor: "green", padding: 10 },
  reward:
  { flex: 1, justifyContent: "center", alignItems: "center" },
  heart: 
  { fontSize: 100, marginBottom: 20 },
  playAgain:
   { marginTop: 20, backgroundColor: "#6C5CE7", padding: 12, borderRadius: 15 },
});