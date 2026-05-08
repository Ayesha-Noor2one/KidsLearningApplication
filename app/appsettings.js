import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

let globalSound = null;
let globalMusicOn = false;
let globalVolume = 0.1;

export default function SettingsScreen() {
  const router = useRouter();

  const [musicOn, setMusicOn] = useState(globalMusicOn);
  const [volume, setVolume] = useState(globalVolume);

  const isLoaded = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (!globalSound) {
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/bro.mpeg'
          },
          {
            shouldPlay: false,
            isLooping: true,
            volume: globalVolume
          }
        );

        globalSound = sound;
        isLoaded.current = true;
      }
    };

    init();
  }, []);

  const handleMusicToggle = async (value) => {
    if (!globalSound) return;

    if (value) {
      await globalSound.setVolumeAsync(volume);
      await globalSound.playAsync();
      globalMusicOn = true;
      setMusicOn(true);
    } else {
      await globalSound.pauseAsync();
      globalMusicOn = false;
      setMusicOn(false);
    }
  };

  const handleVolumeChange = async (val) => {
    setVolume(val);
    globalVolume = val;

    if (globalSound && globalMusicOn) {
      await globalSound.setVolumeAsync(val);
    }
  };

  return (
    <View style={styles.container}>

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

        <View style={styles.volumeBox}>
          <Text style={styles.label}>Music Volume</Text>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="#6C5CE7"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#FF7675"
          />

          <Text style={styles.volumeText}>
            Volume: {Math.round(volume * 100)}%
          </Text>
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

  volumeBox: {
    marginTop: 10,
  },

  volumeText: {
    textAlign: "center",
    marginTop: 5,
    color: "#FF7675",
    fontWeight: "600",
  },
});