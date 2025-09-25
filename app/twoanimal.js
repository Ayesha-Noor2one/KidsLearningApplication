import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const animalEmojis = [
  { name: 'Cat', emoji: '🐱' },
  { name: 'Dog', emoji: '🐶' },
  { name: 'Cow', emoji: '🐮' },
  { name: 'Lion', emoji: '🦁' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Monkey', emoji: '🐵' },
];

export default function AnimalEmojiScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const handlePress = (item) => {
    setSelected(item.name);
    Alert.alert('You tapped:', item.name);
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/twofun')} 
      >
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>

      <Text style={styles.title}>Animal Identification</Text>

      <FlatList
        data={animalEmojis}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.emojiBox,
              selected === item.name ? { backgroundColor: '#d1f7d6' } : null,
            ]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fefefe', paddingHorizontal: 10 },
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
  title: { fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  list: { justifyContent: 'center' },
  emojiBox: {
    flex: 1,
    height: 120,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#fff9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  emoji: { fontSize: 50 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
});
