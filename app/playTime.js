// app/learnandfun.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;

export default function LearnAndFun() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Play Time</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6F61' }]}
          onPress={() => navigateTo('/poemstory')}
        >
          <FontAwesome5 name="font" size={22} color="#fff" />
          <Text style={styles.buttonText}>Poems & Stories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6A5ACD' }]}
          onPress={() => navigateTo('/memorygames')}
        >
          <FontAwesome5 name="sort-numeric-up" size={22} color="#fff" />
          <Text style={styles.buttonText}>Games</Text>
        </TouchableOpacity>

       
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 40,
    fontFamily: 'Consolas',
    backgroundColor: '#fff9',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  button: {
    width: BUTTON_WIDTH,
    paddingVertical: 20,
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Consolas',
  },
});
