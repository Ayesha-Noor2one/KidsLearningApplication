import React, { useState, useRef } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Audio } from 'expo-av';

const stories = [
  { id: '1', title: 'The Light Princess', image: require('../assets/images/lightpri.jpg'), audio: require('../assets/sounds/lightprincess.mp3') },
  { id: '2', title: 'The Little Mermaid', image: require('../assets/images/mermaid.jpg'), audio: require('../assets/sounds/mermaid.mp3') },
  { id: '3', title: 'Little Louie', image: require('../assets/images/louie.jpg'), audio: require('../assets/sounds/LittleLouie.mp3') },
  { id: '4', title: 'How the Leopard’s got his Spots', image: require('../assets/images/leopard.jpg'), audio: require('../assets/sounds/leopardspots.mp3') },
  // { id: '5', title: 'The Emperors New Clothes', image: require('../assets/images/emperor.jpg'), audio: require('../assets/sounds/emperor.mp3') },
  // { id: '6', title: 'Guppy Goop & the Adventure of Big Bad Fish', image: require('../assets/images/guppy.jpg'), audio: require('../assets/sounds/GuppyGoopBigBadFish.mp3') },
  // { id: '7', title: 'Legend of the Black Sea', image: require('../assets/images/black.jpg'), audio: require('../assets/sounds/TheLegendOfTheBlackSea.mp3') },
  // { id: '8', title: 'Rapunzel', image: require('../assets/images/rapunzel.jpg'), audio: require('../assets/sounds/Rapunzel.mp3') },
  // { id: '9', title: 'The Tale of Squirrel Nutkin', image: require('../assets/images/squirrel.jpg'), audio: require('../assets/sounds/TheTaleOfSquirrelNutkin.mp3') },
  // { id: '10', title: 'The Flopsy Bunnies', image: require('../assets/images/flopsy.jpg'), audio: require('../assets/sounds/TheTaleOfTheFlopsyBunnies.mp3') },
  // { id: '11', title: 'How the Camel Got His Hump', image: require('../assets/images/camel.jpg'), audio: require('../assets/sounds/HowTheCamelGotHisHump.mp3') },
  // { id: '12', title: 'The Tale of Peter Rabbit', image: require('../assets/images/peter.jpg'), audio: require('../assets/sounds/TheTaleOfPeterRabbit.mp3') },
  // { id: '13', title: 'The Persistent Rain Cloud', image: require('../assets/images/cloud.webp'), audio: require('../assets/sounds/ThePersistentRainCloud.mp3') },
  // { id: '14', title: 'Piggis Play Games', image: require('../assets/images/piggy.jpg'), audio: require('../assets/sounds/piggis-play-games.mp3') },
  // { id: '15', title: 'Windswept', image: require('../assets/images/windswept.jpg'), audio: require('../assets/sounds/Windswept.mp3') },
  // { id: '16', title: 'The Ugly Ducklings', image: require('../assets/images/ugly.jpg'), audio: require('../assets/sounds/ugly.wav') },
  // { id: '17', title: 'The Tortoise and the Hare', image: require('../assets/images/torha.jpg'), audio: require('../assets/sounds/torha.wav') },
  // { id: '18', title: 'Jack and the Beanstalk', image: require('../assets/images/jack.jpg'), audio: require('../assets/sounds/jack.wav') },
  // { id: '19', title: 'Beauty and the Beast', image: require('../assets/images/beauty.jpg'), audio: require('../assets/sounds/beauty.wav') },
  // { id: '20', title: 'Goldilocks and the three Bears', image: require('../assets/images/goldilocks.jpg'), audio: require('../assets/sounds/goldilocks.wav') },
  // { id: '21', title: 'Hansel and the Gretel', image: require('../assets/images/hansel.jpg'), audio: require('../assets/sounds/hansel.wav') },
  // { id: '22', title: 'The Three Little Pigs', image: require('../assets/images/little.jpg'), audio: require('../assets/sounds/little.mp3') },
  // { id: '23', title: 'Ant and the Grashopper', image: require('../assets/images/ant.jpg'), audio: require('../assets/sounds/ant.wav') },
];

export default function StoriesListScreen() {
  const [selectedStory, setSelectedStory] = useState(null);
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
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
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
`1`