import React, { useState, useRef } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Audio } from 'expo-av';

const poems = [
  { id: '1', title: 'Twinkle Twinkle Little Star', image: require('../assets/images/twinkle.jpg'), audio: require('../assets/sounds/twinkle.mp3') },
  { id: '2', title: 'Baa Baa Black Sheep', image: require('../assets/images/blacksheep.jpg'), audio: require('../assets/sounds/baa baa.mp3') },
  { id: '3', title: 'Humpty Dumpty', image: require('../assets/images/humpty.jpg'), audio: require('../assets/sounds/humpty dumpty.mp3') },
  { id: '4', title: 'Jack and Jill', image: require('../assets/images/jackjill.jpg'), audio: require('../assets/sounds/jack and jill.mp3') },
  { id: '5', title: 'Hickory Dickory Dock', image: require('../assets/images/hickory.jpg'), audio: require('../assets/sounds/hickory.mp3') },
  { id: '6', title: 'Row Row Row Your Boat', image: require('../assets/images/row row.jpg'), audio: require('../assets/sounds/row row.mp3') },
  { id: '7', title: 'Mary Had a Little Lamb', image: require('../assets/images/mary.jpg'), audio: require('../assets/sounds/mary had.mp3') },
  { id: '8', title: 'London Bridge is Falling Down', image: require('../assets/images/london.jpg'), audio: require('../assets/sounds/london.mp3') },
  { id: '9', title: 'Old MacDonald Had a Farm', image: require('../assets/images/oldmac.jpg'), audio: require('../assets/sounds/old mac.mp3') },
  { id: '10', title: 'Rain Rain Go Away', image: require('../assets/images/rain.jpg'), audio: require('../assets/sounds/rain rain.mp3') },
  { id: '11', title: 'Five Little Monkeys', image: require('../assets/images/little.jpg'), audio: require('../assets/sounds/five little.mp3') },
  { id: '12', title: 'One Two Buckle My Shoe', image: require('../assets/images/buckle.jpg'), audio: require('../assets/sounds/buckle.mp3') },
  { id: '13', title: 'Wheel on the bus', image: require('../assets/images/wheel.jpg'), audio: require('../assets/sounds/wheel on the bus.mp3') },
  { id: '14', title: 'Ring a Ring o’ Roses', image: require('../assets/images/ringa.jpg'), audio: require('../assets/sounds/ringa.mp3') },
];

export default function PoemsListScreen() {
  const [selectedPoem, setSelectedPoem] = useState(null);
  const sound = useRef(new Audio.Sound());

  const playAudio = async (audioFile) => {
    try {
      await sound.current.unloadAsync();
      await sound.current.loadAsync(audioFile);
      await sound.current.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const openPoem = async (poem) => {
    setSelectedPoem(poem);
    await playAudio(poem.audio);
  };

  const closeModal = async () => {
    setSelectedPoem(null);
    await sound.current.stopAsync();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={poems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openPoem(item)}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedPoem} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedPoem && (
              <>
                <Image source={selectedPoem.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedPoem.title}</Text>
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
  card: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#fce4ec',
    borderRadius: 10,
    padding: 10,
  },
  cardImage: { width: 100, height: 100, borderRadius: 10 },
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
  modalImage: { width: 250, height: 250, borderRadius: 12, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  closeButton: {
    backgroundColor: '#ff80ab',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  closeText: { color: '#fff', fontSize: 16 },
});
