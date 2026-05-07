import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findByEmail } from './database';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 80) / 3;

const Settings = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const animValues = useRef(
    Array.from({ length: 6 }).map(() => new Animated.Value(1))
  ).current;

  
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        setUsername(storedEmail || '');
        const res = await findByEmail(storedEmail);
        setName(res.name);
      } catch (error) {}
    };
    loadProfile();

   
    animValues.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.08,
            duration: 900 + i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 900 + i * 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

  
    const animate = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const handleBackPress = () => {
    Alert.alert("Confirmation", "Do you want to go to Login page?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => router.replace("/Login") },
    ]);
  };

  return (
    <View style={styles.container}>

      
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <FontAwesome name="arrow-left" size={24} color="#ffffffff" />
      </TouchableOpacity>

      <View style={styles.card}>

        
        <View style={styles.dotContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1, backgroundColor: "#FFD93D" }]} />
          <Animated.View style={[styles.dotBig, { opacity: dot2, backgroundColor: "#6C5CE7" }]} />
          <Animated.View style={[styles.dot, { opacity: dot3, backgroundColor: "#FF7675" }]} />
        </View>

        <Text style={styles.username}>🎉 Welcome</Text>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.grid}>
          <SettingsTile icon="user" text="Profile" href="/manageprofile" anim={animValues[0]} />
          <SettingsTile icon="child" text="Children" href="/manageChildren" anim={animValues[1]} />
          <SettingsTile icon="sign-out" text="Logout" href="/Login" anim={animValues[2]} />
          <SettingsTile icon="line-chart" text="Progress" href="/childrenProgress" anim={animValues[3]} />
          <SettingsTile icon="cogs" text="Settings" href="/appsettings" anim={animValues[4]} />
          <SettingsTile icon="info-circle" text="About" href="/about" anim={animValues[5]} />
        </View>
      </View>
    </View>
  );
};

const SettingsTile = ({ icon, text, href, anim }) => {
  const router = useRouter();

  const handlePress = () => {
    if (text === 'Logout') {
      Alert.alert('Logout Confirmation', 'Are you sure?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.replace(href) },
      ]);
    } else {
      router.push(href);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: anim }] }}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.tile}>
          <FontAwesome name={icon} size={32} color= "#FF7675" />
          <Text style={styles.tileText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    alignItems: "center",
    justifyContent: "center",
  },

  
  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFD93D",
    top: -50,
    left: -60,
    opacity: 0.3,
  },

  circle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6C5CE7",
    bottom: 60,
    right: -50,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FF7675",
    top: 220,
    right: -30,
    opacity: 0.25,
  },

 backButton:
  { position: "absolute", 
    top: 30, left: 20,
     backgroundColor: "#8373f9ff",
      padding: 12, borderRadius: 30
     },

  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#943dffff',
    elevation: 10,
  },

  username: {
    fontSize: 20,
    color: '#8B0000',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 10,
  },

  
  dotContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  dot: {
    width: 15,
    height: 15,
    borderRadius: 7,
    marginHorizontal: 3,
  },

  dotBig: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 3,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap:9,
  },

  tile: {
    width: 140,
    height: 140,
    backgroundColor: '#f7e520ff',
    borderRadius: 18,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap:20,
  },

  tileText: {
    fontSize: 18,
    color: '#ff6a00ff',
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default Settings;