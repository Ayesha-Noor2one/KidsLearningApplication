import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

const emojis = ["🍎","🍌","🍓","🍇","🍉","🍒","🍍","🥝","🍑","🥭"];
const emojiNames = ["apple","banana","strawberry","grapes","watermelon","cherry","pineapple","kiwi","peach","mango"];
const numberWords = ["one","two","three","four","five","six","seven","eight","nine","ten"];

export default function CountingGame() {
  const router = useRouter();

  const [level, setLevel] = useState(1);
  const [items, setItems] = useState([]);
  const [collected, setCollected] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const animations = useRef([]);
  const starScale = useRef(new Animated.Value(1)).current;
  const starFloat = useRef(new Animated.Value(0)).current;

 
  const bgAnim = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false
        }),
        Animated.timing(bgAnim, {
          toValue: 2,
          duration: 2500,
          useNativeDriver: false
        }),
        Animated.timing(bgAnim, {
          toValue: 3,
          duration: 2500,
          useNativeDriver: false
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false
        })
      ])
    ).start();
  }, []);

  
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["#D7F9FF", "#FFF3C7", "#E8FFE8", "#FFE4F2"]
  });

  
  useEffect(() => {
    animations.current = items.map(() => new Animated.Value(0));

    animations.current.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 600 + index * 100,
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600 + index * 100,
            useNativeDriver: true
          })
        ])
      ).start();
    });
  }, [items]);

 
  useEffect(() => {
    const newItems = [...Array(level)].map((_, i) => ({
      id: i,
      collected: false
    }));
    setItems(newItems);
    setCollected(0);
  }, [level]);


  const speakWord = (text, callback) => {
    setIsBusy(true);

    Speech.stop();
    Speech.speak(text, {
      rate: 0.8,
      pitch: 1.2,
      onDone: () => {
        setIsBusy(false);
        callback && callback();
      },
      onStopped: () => setIsBusy(false)
    });
  };

  const handleCollect = (id) => {
    if (isBusy) return;

    const updated = items.map(item =>
      item.id === id ? { ...item, collected: true } : item
    );

    setItems(updated);

    const newCount = collected + 1;
    setCollected(newCount);

    speakWord(numberWords[newCount - 1], () => {
      if (newCount === level) {
        speakWord(`${numberWords[level-1]} ${emojiNames[level-1]}!`, () => {
          if (level === 10) {
            setShowReward(true);
          } else {
            setLevel(prev => prev + 1);
          }
        });
      }
    });
  };

  const handleBack = () => {
    Alert.alert(
      "Exit Game?",
      [
        { text: "No", style: "cancel", },
        { text: "Yes", onPress: () => router.push("/three") }
      ]
    );
  };

  useEffect(() => {
    if (showReward) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(starScale, { toValue: 1.3, duration: 600, useNativeDriver: true }),
            Animated.timing(starScale, { toValue: 1, duration: 600, useNativeDriver: true })
          ]),
          Animated.sequence([
            Animated.timing(starFloat, { toValue: -15, duration: 800, useNativeDriver: true }),
            Animated.timing(starFloat, { toValue: 0, duration: 800, useNativeDriver: true })
          ])
        ])
      ).start();
    }
  }, [showReward]);

  if (showReward) {
    return (
      <View style={styles.rewardContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/three")}>
          <Text style={{color:"#fff", fontSize:20}}>←</Text>
        </TouchableOpacity>

        <Text style={styles.rewardText}>🎉 You did it!</Text>

        <Animated.Text
          style={[
            styles.star,
            {
              transform: [
                { scale: starScale },
                { translateY: starFloat }
              ]
            }
          ]}
        >
          🏆
        </Animated.Text>

        <TouchableOpacity
          style={styles.replayBtn}
          onPress={() => {
            setLevel(1);
            setShowReward(false);
          }}
        >
          <Text style={{color:"#fff"}}> Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>

      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={{color:"#fff", fontSize:20}}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Count & Collect</Text>
      <Text style={styles.levelText}>Level {level}/10</Text>

      <View style={styles.card}>
        <Text style={styles.number}>{level}</Text>

        <View style={styles.emojiContainer}>
          {items.map((item, index) => !item.collected && (
            <TouchableOpacity key={item.id} onPress={() => handleCollect(item.id)}>
              <Animated.Text
                style={[
                  styles.emoji,
                  { transform: [{ translateY: animations.current[index] || 0 }] }
                ]}
              >
                {emojis[level-1]}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.instruction}>Tap & Count!</Text>
      </View>

      <View style={styles.collectionBox}>
        {Array.from({ length: collected }).map((_, i) => (
          <Text key={i} style={styles.collectedEmoji}>
            {emojis[level-1]}
          </Text>
        ))}
      </View>

    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container:{ flex:1, alignItems:"center", paddingTop:60 },

  backBtn:{
    position:"absolute",
    top:50,
    left:20,
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:"#4caf50",
    justifyContent:"center",
    alignItems:"center"
  },

  title:{ fontSize:26, fontWeight:"bold" },
  levelText:{ marginTop:10, fontSize:18 },

  card:{
    marginTop:30,
    width:320,
    height:360,
    backgroundColor:"#fff",
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center",
    elevation:5
  },

  number:{ fontSize:40, fontWeight:"bold", marginBottom:10 },

  emojiContainer:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center",
    paddingHorizontal:15
  },

  emoji:{ fontSize:55, margin:6 },

  instruction:{ marginTop:10, fontSize:16, color:"#555" },

  collectionBox:{
    marginTop:20,
    width:250,
    minHeight:70,
    backgroundColor:"#ffccff",
    borderRadius:20,
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center",
    alignItems:"center",
    padding:10
  },

  collectedEmoji:{ fontSize:30, margin:3 },

  rewardContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#ffe4f2"
  },

  rewardText:{
    fontSize:28,
    fontWeight:"bold"
  },

  star:{
    fontSize:100,
    marginTop:30
  },

  replayBtn:{
    marginTop:30,
    backgroundColor:"#ff4081",
    padding:15,
    borderRadius:15
  }
});