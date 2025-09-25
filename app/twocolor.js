import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const colors = [
  { name: 'Red', code: '#e74c3c', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/red.wav' } },
  { name: 'Yellow', code: '#f1c40f', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/yellow.wav' } },
  { name: 'Blue', code: '#2980b9', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/blue.wav' } },
  { name: 'Green', code: '#27ae60', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/green.wav' } },
  { name: 'Pink', code: '#d35db3', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/pink.wav' } },
  { name: 'Purple', code: '#8e44ad', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/purple.wav' } },
  { name: 'White', code: '#ecf0f1', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/white.wav' } },
  { name: 'Orange', code: '#e67e22', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/oran.wav' } },
  { name: 'Gray', code: '#95a5a6', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/grey.wav' } },
  { name: 'Brown', code: '#8e6e53', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/brown.wav' } },
  { name: 'Black', code: '#000000', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/black.wav' } },
  { name: 'Cyan', code: '#00FFFF', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/cyan.wav' } },
  { name: 'Lime', code: '#00FF00', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/lime.wav' } },
  { name: 'Indigo', code: '#4B0082', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/indigo.wav' } },
  { name: 'Gold', code: '#FFD700', sound: { uri: 'https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/sounds/gold.wav' } },
];

export default function ColorsScreen() {
  const [sound, setSound] = useState(null);
  const router = useRouter();

  const playSound = async (soundFile) => {
    if (sound) {
      await sound.unloadAsync(); 
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/twofun')}>
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.title}>Learn Colors</Text>
      <FlatList
        data={colors}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.colorBox, { backgroundColor: item.code }]}
            onPress={() => playSound(item.sound)}
          >
            <Text style={[styles.colorText, item.name === 'Black' ? { color: 'white' } : null]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    justifyContent: 'center',
  },
  colorBox: {
    flex: 1,
    height: 120,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
