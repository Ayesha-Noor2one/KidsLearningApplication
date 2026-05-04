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
import { useNavigation } from "@react-navigation/native";

export default function ABCObjectQuiz() {
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const starAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const lock = useRef(false);

  const data = [
    { image: "🐜", name: "ANT", letter: "A" },
    { image: "🐱", name: "CAT", letter: "C" },
    { image: "🐶", name: "DOG", letter: "D" },
    { image: "🥚", name: "EGG", letter: "E" },
    { image: "🍇", name: "GRAPES", letter: "G" },
    { image: "🏠", name: "HOUSE", letter: "H" },
    { image: "🍦", name: "ICECREAM", letter: "I" },
    { image: "☂️", name: "UMBRELLA", letter: "U" },
    { image: "⚽", name: "BALL", letter: "B" },
    { image: "🧃", name: "JUICE", letter: "J" },
    { image: "🪁", name: "KITE", letter: "K" },
    { image: "🦁", name: "LION", letter: "L" },
    { image: "🥭", name: "MANGO", letter: "M" },
    { image: "🪺", name: "NEST", letter: "N" },
    { image: "🍊", name: "ORANGE", letter: "O" },
    { image: "🖊️", name: "PEN", letter: "P" },
    { image: "👑", name: "QUEEN", letter: "Q" },
    { image: "🐰", name: "RABBIT", letter: "R" },
    { image: "☀️", name: "SUN", letter: "S" },
    { image: "🌳", name: "TREE", letter: "T" },
    { image: "🚐", name: "VAN", letter: "V" },
    { image: "🍉", name: "WATERMELON", letter: "W" },
    { image: "🎸", name: "XYLOPHONE", letter: "X" },
    { image: "🐟", name: "FISH", letter: "F" },
    { image: "🛳️", name: "YACHT", letter: "Y" },
    { image: "🦓", name: "ZEBRA", letter: "Z" },
  ];

  const current = data[index];

  /* 🎨 BG */
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
    outputRange: ["#EAF7FF", "#FFF3E0"],
  });

  /* OPTIONS */
  const generateOptions = () => {
    const letters = data.map(d => d.letter);
    const wrongArr = [];

    while (wrongArr.length < 2) {
      const pick = letters[Math.floor(Math.random() * letters.length)];
      if (pick !== current.letter && !wrongArr.includes(pick)) {
        wrongArr.push(pick);
      }
    }

    setOptions([...wrongArr, current.letter].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateOptions();
  }, [index]);

  /* ICON */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(iconAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const showStar = () => {
    starAnim.setValue(0);
    Animated.sequence([
      Animated.timing(starAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(starAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const onSelect = (l) => {
    if (lock.current) return;
    lock.current = true;

    if (l === current.letter) {
      setRight(r => r + 1);
      showStar();

      setTimeout(() => {
        if (index < data.length - 1) setIndex(i => i + 1);
        else setShowReward(true);
        lock.current = false;
      }, 500);
    } else {
      setWrong(w => w + 1);
      shake();
      setTimeout(() => (lock.current = false), 300);
    }
  };

  if (showReward)
    return (
      <RewardScreen
        right={right}
        wrong={wrong}
        setIndex={setIndex}
        setRight={setRight}
        setWrong={setWrong}
        setShowReward={setShowReward}
        navigation={navigation}
      />
    );

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      {/* BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setShowExit(true)}>
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>
        <Text style={{ color: "#FF6B6B" }}>A</Text>
        <Text style={{ color: "#4ECDC4" }}>B</Text>
        <Text style={{ color: "#FFD93D" }}>C</Text> Quiz
      </Text>

      <Animated.Text style={[styles.icon, { transform: [{ scale: iconAnim }] }]}>
        {current.image}
      </Animated.Text>

      <Animated.View style={[styles.row, { transform: [{ translateX: shakeAnim }] }]}>
        {options.map((l, i) => (
          <TouchableOpacity key={i} onPress={() => onSelect(l)}>
            <View style={[styles.option, { backgroundColor: colors[i % 5] }]}>
              <Text style={styles.txt}>{l}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* SPELLING */}
      <Text style={styles.spell}>{current.name}</Text>

      <Animated.View style={[styles.star, { opacity: starAnim }]}>
        <Text style={{ fontSize: 60 }}>⭐</Text>
      </Animated.View>

      <Text style={styles.score}>✔ {right} ❌ {wrong}</Text>

      {/* EXIT POPUP */}
      {showExit && (
        <View style={styles.modal}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Exit Game?</Text>
            <View style={styles.popupBtns}>
              <TouchableOpacity style={[styles.popupBtn,{backgroundColor:"green"}]} onPress={()=>navigation.navigate("four")}>
                <Text style={styles.popupText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.popupBtn,{backgroundColor:"red"}]} onPress={()=>setShowExit(false)}>
                <Text style={styles.popupText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

/* 🎉 REWARD SCREEN */
const RewardScreen = ({ right, wrong, setIndex, setRight, setWrong, setShowReward, navigation }) => {
  const heart = useRef(new Animated.Value(0)).current;
  const [showExit,setShowExit]=useState(false);

  useEffect(()=>{
    Animated.loop(
      Animated.sequence([
        Animated.timing(heart,{toValue:1,duration:600,useNativeDriver:true}),
        Animated.timing(heart,{toValue:0,duration:600,useNativeDriver:true}),
      ])
    ).start();
  },[]);

  const scale = heart.interpolate({ inputRange:[0,1], outputRange:[1,1.5] });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={()=>setShowExit(true)}>
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Animated.Text style={{fontSize:90,transform:[{scale}]}}>💗</Animated.Text>

      <Text style={{fontSize:28}}>Great Job!</Text>
      <Text>✔ {right} ❌ {wrong}</Text>

      <TouchableOpacity style={styles.playAgain} onPress={()=>{
        setIndex(0);
        setRight(0);
        setWrong(0);
        setShowReward(false);
      }}>
        <Text style={{color:"#fff"}}>Play Again</Text>
      </TouchableOpacity>

      {showExit && (
        <View style={styles.modal}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Exit Game?</Text>
            <View style={styles.popupBtns}>
              <TouchableOpacity style={[styles.popupBtn,{backgroundColor:"green"}]} onPress={()=>navigation.navigate("four")}>
                <Text style={styles.popupText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.popupBtn,{backgroundColor:"red"}]} onPress={()=>setShowExit(false)}>
                <Text style={styles.popupText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const colors=["#FF6B6B","#4ECDC4","#FFD93D","#6C5CE7","#00C853"];

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:"center"},
  backBtn:{position:"absolute",top:50,left:20,backgroundColor:"#6C5CE7",padding:10,borderRadius:20},
  title:{position:"absolute",top:60,fontSize:26,fontWeight:"bold"},
  icon:{fontSize:120},
  row:{flexDirection:"row",marginTop:10},
  option:{margin:10,padding:18,borderRadius:15,width:70,alignItems:"center"},
  txt:{color:"#fff",fontSize:28,fontWeight:"bold"},
  spell:{fontSize:26,color:"#bbb",marginTop:15},
  star:{position:"absolute",top:"40%"},
  score:{position:"absolute",bottom:30,fontSize:18},
  modal:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"center",alignItems:"center"},
  popup:{backgroundColor:"#fff",padding:25,borderRadius:20,width:"75%",alignItems:"center"},
  popupTitle:{fontSize:20,fontWeight:"bold",marginBottom:20},
  popupBtns:{flexDirection:"row",width:"100%"},
  popupBtn:{flex:1,marginHorizontal:5,padding:12,borderRadius:12,alignItems:"center"},
  popupText:{color:"#fff",fontWeight:"bold"},
  playAgain:{marginTop:20,backgroundColor:"#6C5CE7",padding:15,borderRadius:20}
});