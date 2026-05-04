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

const ALL_ITEMS = ["🍎","🍌","🚗","🐱","⭐","🍇","🥕","🍊","🚀","⚽","🎈"];

export default function Game() {

  const router = useRouter();

  const MAX_LEVEL = 10;
  const [level, setLevel] = useState(1);

  const [targetItem, setTargetItem] = useState("🍎");
  const [targetCount, setTargetCount] = useState(3);

  const [items, setItems] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [used, setUsed] = useState([]);

  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [popup, setPopup] = useState(false);
  const [reward, setReward] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const targetAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  /* 🌈 BG */
  useEffect(() => {
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0,1],
    outputRange: ["#AEE6FF","#FFD6F5"],
  });

  /* 🎯 TARGET ICON */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(targetAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
        Animated.timing(targetAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* ❤️ REWARD HEART */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, { toValue: 1.4, duration: 500, useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* 🎯 LEVEL */
  const startLevel = () => {
    const tItem = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    const tCount = Math.floor(Math.random() * 4) + 3;

    setTargetItem(tItem);
    setTargetCount(tCount);

    const correct = Array(tCount).fill(tItem);
    const random = ALL_ITEMS
      .filter(i => i !== tItem)
      .sort(() => Math.random() - 0.5)
      .slice(0,5);

    const mix = [...correct,...random].sort(() => Math.random() - 0.5);

    setItems(mix);
    setBoxes(Array(tCount).fill(null));
    setUsed([]);

    Speech.speak(`Collect ${tCount} ${tItem}`);
  };

  useEffect(() => {
    startLevel();
  }, [level]);

  /* ❌ SHAKE */
  const playShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* 🧠 TAP */
  const placeItem = (index) => {

    if (used.includes(index)) return;

    const item = items[index];

    const empty = boxes.findIndex(b => b === null);
    if (empty === -1) return;

    let newBoxes = [...boxes];
    newBoxes[empty] = item;

    setBoxes(newBoxes);
    setUsed(prev => [...prev,index]);

    if (item === targetItem) {
      setRight(r => r + 1);

      const done = newBoxes.filter(b => b === targetItem).length;

      if (done === targetCount) {
        if (level >= MAX_LEVEL) {
          setTimeout(() => setReward(true), 500);
        } else {
          setTimeout(() => setLevel(l => l + 1), 500);
        }
      }

    } else {
      setWrong(w => w + 1);
      playShake();

      setTimeout(() => {
        setBoxes(Array(targetCount).fill(null));
        setUsed([]);
      }, 400);
    }
  };

  const reset = () => {
    setLevel(1);
    setRight(0);
    setWrong(0);
    setReward(false);
  };

  /* 🎉 FULL SCREEN REWARD */
  if (reward) {
    return (
      <Animated.View style={[styles.container,{ backgroundColor: bgColor }]}>

        {/* BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => setPopup(true)}>
          <FontAwesome name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.centerReward}>

          <Animated.Text style={{
            fontSize:100,
            transform:[{ scale: heartAnim }]
          }}>
            ❤️
          </Animated.Text>

          <Text style={{ fontSize:28, marginTop:10 }}>Amazing!</Text>

        </View>

        {/* BOTTOM */}
        <View style={styles.bottomBar}>
          <Text>✔ {right}</Text>
          <Text>❌ {wrong}</Text>

          <TouchableOpacity style={styles.btn} onPress={reset}>
           <Text style={{ fontSize:20, marginTop:20 }}>Amazing!</Text>
            <Text style={{color:"#fff"}}>Play Again</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container,{ backgroundColor: bgColor }]}>

      {/* BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setPopup(true)}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>

      {/* POPUP */}
      <Modal visible={popup} transparent>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={{fontSize:18}}>Exit Game?</Text>

            <View style={{ flexDirection:"row", marginTop:20 }}>
              <TouchableOpacity style={styles.no} onPress={() => setPopup(false)}>
                <Text style={{color:"#fff"}}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.yes} onPress={() => router.push("/three")}>
                <Text style={{color:"#fff"}}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TITLE */}
      <Text style={styles.title}>🌈 Fun Counting Game</Text>

      {/* TASK */}
      <View style={styles.taskRow}>
        <Text style={styles.taskText}>Collect {targetCount}</Text>

        <Animated.Text style={[
          styles.targetEmoji,
          { transform:[{ scale: targetAnim }] }
        ]}>
          {targetItem}
        </Animated.Text>
      </View>

      {/* BOXES (FIXED WRAP) */}
      <Animated.View style={{ transform:[{ translateX: shakeAnim }] }}>
        <View style={styles.boxRow}>
          {boxes.map((b,i) => (
            <View key={i} style={styles.box}>
              {b && <Text style={styles.big}>{b}</Text>}
            </View>
          ))}
        </View>
      </Animated.View>

      {/* ITEMS */}
      <View style={styles.grid}>
        {items.map((item,i) => (
          <TouchableOpacity
            key={i}
            disabled={used.includes(i)}
            onPress={() => placeItem(i)}
            style={[
              styles.card,
              used.includes(i) && { opacity:0.3 }
            ]}
          >
            <Text style={{fontSize:35}}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SCORE */}
      <View style={styles.score}>
        <Text>✔ {right}</Text>
        <Text>❌ {wrong}</Text>
      </View>

    </Animated.View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({

  container:{ flex:1, alignItems:"center", paddingTop:80 },

  title:{ fontSize:26, fontWeight:"bold", color:"#FF1493" },

  taskRow:{ flexDirection:"row", alignItems:"center", marginTop:15 },

  taskText:{ fontSize:22, fontWeight:"bold" },

  targetEmoji:{ fontSize:45, marginLeft:10 },

  boxRow:{
    flexDirection:"row",
    flexWrap:"wrap", // ✅ FIX
    justifyContent:"center",
    width:"90%"
  },

  box:{
    width:70,
    height:70,
    margin:6,
    borderWidth:2,
    borderColor:"#00C853",
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#E8FFE8"
  },

  big:{ fontSize:30 },

  grid:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center",
    marginTop:30
  },

  card:{
    width:75,
    height:75,
    margin:6,
    borderRadius:15,
    backgroundColor:"#fff",
    justifyContent:"center",
    alignItems:"center",
    elevation:4
  },

  score:{
    position:"absolute",
    bottom:30,
    flexDirection:"row",
    gap:20
  },

  bottomBar:{
    position:"absolute",
    bottom:30,
    alignItems:"center"
  },

  centerReward:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  backBtn:{
    position:"absolute",
    top:40,
    left:20,
    backgroundColor:"#FF6F61",
    padding:10,
    borderRadius:20
  },

  overlay:{
    flex:1,
    backgroundColor:"#00000088",
    justifyContent:"center",
    alignItems:"center"
  },

  popup:{
    backgroundColor:"#fff",
    padding:25,
    borderRadius:20,
    alignItems:"center"
  },

  yes:{ backgroundColor:"green", padding:10, marginLeft:10, borderRadius:10 },

  no:{ backgroundColor:"red", padding:10, borderRadius:10 },

  btn:{
    marginTop:10,
    backgroundColor:"green",
    padding:10,
    borderRadius:10
  }

});