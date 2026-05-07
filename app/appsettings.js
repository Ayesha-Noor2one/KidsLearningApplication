import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { getUsageTime, updateParentUsageTime } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const [musicOn, setMusicOn] = useState(false);
  const [usageLimit, setUsageLimit] = useState(1);
  const soundRef = useRef(null);

  useEffect(() => {
    const loadUsageLimitTime = async () => {
      try {
        const parentId = await AsyncStorage.getItem('parentId');
        const res = await getUsageTime(parentId);
        if (res?.allowedHours && res.allowedHours >= 1) {
          setUsageLimit(res.allowedHours);
        } else {
          setUsageLimit(1);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    loadUsageLimitTime();

    const prepareSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/bro.mpeg' },
          { shouldPlay: false, isLooping: true, volume: 0.1 }
        );
        soundRef.current = sound;
      } catch (e) {
        console.error('Error loading sound:', e);
      }
    };

    prepareSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleMusicToggle = async (value) => {
    if (!soundRef.current) return;
    try {
      if (value) {
        await soundRef.current.playAsync();
        setMusicOn(true);
      } else {
        await soundRef.current.pauseAsync();
        setMusicOn(false);
      }
    } catch (e) {
      console.error('Music toggle error:', e);
    }
  };

  return (
    <View style={styles.container}>

      {/* background circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <FontAwesome
        name="arrow-left"
        size={24}
        color="#6C5CE7"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      <Text style={styles.header}>SETTINGS</Text>

      <View style={styles.card}>

        <View style={styles.row}>
          <Text style={styles.label}>Background Music</Text>
          <Switch
            trackColor={{ false: '#F44336', true: '#4CAF50' }}
            thumbColor="#fff"
            value={musicOn}
            onValueChange={handleMusicToggle}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>App Timer</Text>
          <View style={styles.usageContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={usageLimit.toString()}
              onChangeText={(text) => {
                const minutes = parseInt(text) || 0;
                setUsageLimit(minutes);
              }}
              onEndEditing={async () => {
                try {
                  const parentId = await AsyncStorage.getItem('parentId');
                  const safeLimit = usageLimit < 1 ? 1 : usageLimit;
                  setUsageLimit(safeLimit);
                  await updateParentUsageTime(parentId, safeLimit);
                } catch (error) {
                  console.error('Error updating limit:', error);
                }
              }}
            />

            <Text style={styles.usageText}>minutes/day</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9ff",
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
    bottom: 80,
    right: -50,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FF7675",
    top: 200,
    right: -20,
    opacity: 0.25,
  },

  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    bachgroundColor: "#9183fa",
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 30,
  },

  card: {
    width: SCREEN_WIDTH - 30,
    backgroundColor: "#fff",
    borderRadius: 35,
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderWidth: 4,
    borderColor: "#9183fa",
    elevation: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  label: {
    fontSize: 18,
    fontWeight: '600',
    color: "#6C5CE7",
  },

  input: {
    width: 80,
    height: 40,
    borderWidth: 2,
    borderColor: "#d9dcff",
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#f4f6ff',
    marginHorizontal: 8,
  },

  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  usageText: {
    fontSize: 16,
    color: "#FF7675",
    fontWeight: "500",
  },
});