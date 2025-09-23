import React, { useState, useRef } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const stories = [
  { id: '1', title: 'The Light Princess', image: require('../assets/images/lightpri.jpg'), audio: require('../assets/sounds/lightprincess.mp3') },
  { id: '2', title: 'The Little Mermaid', image: require('../assets/images/mermaid.jpg'), audio: require('../assets/sounds/mermaid.mp3') },
  { id: '3', title: 'Little Louie', image: require('../assets/images/louie.jpg'), audio: require('../assets/sounds/LittleLouie.mp3') },
  { id: '4', title: 'How the Leopard’s got his Spots', image: require('../assets/images/leopard.jpg'), audio: require('../assets/sounds/leopardspots.mp3') },
];

export default function StoriesListScreen() {
  const [selectedStory, setSelectedStory] = useState(null);
  const sound = useRef(new Audio.Sound());
  const router = useRouter();

  const playAudio = async (audioFile) => {
    try {
      await sound.current.unloadAsync();
      await sound.current.loadAsync(audioFile);
      await sound.current.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const openStory = async (story) => {
    setSelectedStory(story);
    await playAudio(story.audio);
  };

  const closeModal = async () => {
    setSelectedStory(null);
    await sound.current.stopAsync();
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/poemstory')}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openStory(item)}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedStory} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedStory && (
              <>
                <Image source={selectedStory.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedStory.title}</Text>
                <Pressable onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: '#f1f1f1',
    padding: 6,
    borderRadius: 30,
    elevation: 3,
  },
  card: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 10,
  },
  cardImage: { width: 100, height: 120, borderRadius: 10 },
  cardTitle: { marginTop: 10, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalImage: { width: 250, height: 300, borderRadius: 12, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  closeButton: {
    backgroundColor: '#42a5f5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  closeText: { color: '#fff', fontSize: 16 },
});
