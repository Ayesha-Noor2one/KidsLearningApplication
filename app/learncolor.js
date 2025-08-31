import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const colors = [
  { name: 'red', code: '#e74c3c', sound: require('../assets/sounds/red.wav') },
  { name: 'yellow', code: '#f1c40f', sound: require('../assets/sounds/yellow.wav') },
  { name: 'blue', code: '#2980b9', sound: require('../assets/sounds/blue.wav') },
  { name: 'green', code: '#27ae60', sound: require('../assets/sounds/green.wav') },
  { name: 'pink', code: '#d35db3', sound: require('../assets/sounds/pink.wav') },
  { name: 'purple', code: '#8e44ad', sound: require('../assets/sounds/purple.wav') },
  { name: 'white', code: '#ecf0f1', sound: require('../assets/sounds/white.wav') },
  { name: 'orange', code: '#e67e22', sound: require('../assets/sounds/oran.wav') },
  { name: 'gray', code: '#95a5a6', sound: require('../assets/sounds/grey.wav') },
  { name: 'brown', code: '#8e6e53', sound: require('../assets/sounds/brown.wav') },
  { name: 'black', code: '#000000', sound: require('../assets/sounds/black.wav') },
  { name: 'cyan', code: '#00FFFF', sound: require('../assets/sounds/cyan.wav') },
  { name: 'lime', code: '#00FF00', sound: require('../assets/sounds/lime.wav') },
  { name: 'indigo', code: '#4B0082', sound: require('../assets/sounds/indigo.wav') },
  { name: 'gold', code: '#FFD700', sound: require('../assets/sounds/gold.wav') },
];

export default function ColorsScreen() {
  const navigation = useNavigation();
  const [sound, setSound] = React.useState();

  const playSound = async (soundFile) => {
    const { sound: playbackSound } = await Audio.Sound.createAsync(soundFile);
    setSound(playbackSound);
    await playbackSound.playAsync();
  };

  const handleColorPress = async (color) => {
    await playSound(color.sound);
  };

  return (
    <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        {/* Home Icon */}
        <TouchableOpacity
          style={styles.homeIcon}
          onPress={() => navigation.navigate('StartScreen')}>
          <Ionicons name="home" size={30} color="white" />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.heading}>
          <Text style={{ color: 'red' }}>L</Text>
          <Text style={{ color: 'orange' }}>E</Text>
          <Text style={{ color: 'pink' }}>A</Text>
          <Text style={{ color: 'green' }}>R</Text>
          <Text style={{ color: 'blue' }}>N </Text>
          <Text style={{ color: 'red' }}>C</Text>
          <Text style={{ color: 'orange' }}>O</Text>
          <Text style={{ color: 'yellow' }}>L</Text>
          <Text style={{ color: 'green' }}>O</Text>
          <Text style={{ color: 'blue' }}>R</Text>
          <Text style={{ color: 'purple' }}>S</Text>
        </Text>

        {/* Color Grid */}
        <FlatList
          data={colors}
          keyExtractor={(item) => item.name}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleColorPress(item)}
              style={[styles.colorBox, { backgroundColor: item.code }]}>
              <Text style={styles.colorText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.grid}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  homeIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 25,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  colorBox: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  colorText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
});
