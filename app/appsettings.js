import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { getUsageTime, updateParentUsageTime } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BORDER_COLOR = '#8B0000';
const CARD_BG = '#FFD700';

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
      {
        shouldPlay: false,
        isLooping: true,
        volume: 0.1,
      }
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
      <FontAwesome
        name="arrow-left"
        size={24}
        color={BORDER_COLOR}
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      <Text style={styles.header}>SETTINGS*</Text>

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
      const res = await updateParentUsageTime(parentId, safeLimit);
      if (!res || res.changes === 0) {
        console.warn('No update in DB');
      }
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
  container: { flex: 1, backgroundColor: '#F0F4F8', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  backIcon: { position: 'absolute', top: 40, left: 20, zIndex: 2 },
  input: {
    width: 80, height: 40, borderWidth: 2, borderColor: BORDER_COLOR, borderRadius: 10,
    textAlign: 'center', fontSize: 18, backgroundColor: '#fff', marginHorizontal: 8,
  },
  header: { fontSize: 32, fontWeight: 'bold', color: BORDER_COLOR, marginBottom: 30, textDecorationLine: 'underline' },
  card: {
    width: SCREEN_WIDTH - 20, backgroundColor: CARD_BG, borderColor: BORDER_COLOR, borderWidth: 3, borderRadius: 20,
    paddingVertical: 30, paddingHorizontal: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  label: { fontSize: 20, fontWeight: '600', color: BORDER_COLOR },
  usageContainer: { flexDirection: 'row', alignItems: 'center' },
  usageText: { fontSize: 20, color: BORDER_COLOR, minWidth: 60, textAlign: 'center', fontWeight: '500' },
});
