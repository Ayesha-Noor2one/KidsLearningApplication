import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasDone } from './database';
const countingPlay = 'GuessNumber';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicon
const countingLearn = 'CountingLearn';


export default function CountingScreen() {
  const router = useRouter();
  const [countPlayDone, setCountPlayDone] = useState(0);
  const [countLearnDone, setCountLearnDone] = useState(0);

  const checkIfDone = async () => {
    try {
      const kidId = await AsyncStorage.getItem('kidId');
      const res = await hasDone(kidId, countingPlay);
      const res2 = await hasDone(kidId, countingLearn);
      if (res?.isDone === 1) {
        setCountPlayDone(1);
      }
      if (res2?.isDone === 1) {
        setCountLearnDone(1);
      }
    } catch (error) {
      console.error('Error checking if done:', error);
    }
  };

  useEffect(() => {
    checkIfDone();
  }, []);
  return (
    <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/learnandfun')}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Counting</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.blueCard]}
            onPress={() => router.push('/CLearn')}
          >

            <Text style={styles.cardTitle}>
              Learn
              {countLearnDone === 1 ? (
                <Ionicons name="checkmark-circle" size={30} color="green" style={styles.tickIcon} />
              ) : (
                <Ionicons name="hourglass" size={30} color="white" style={styles.tickIcon} />
              )}
            </Text>

          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.card, styles.pinkCard]}
            onPress={() => router.push('/CPlay')}
          >
            <Text style={styles.cardTitle}>
              Play
              {countPlayDone === 1 ? (
                <Ionicons name="checkmark-circle" size={30} color="green" style={styles.tickIcon} />
              ) : (
                <Ionicons name="hourglass" size={30} color="white" style={styles.tickIcon} />
              )}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.card, styles.pinkCard]}
            onPress={() => router.push('/GuessNumber')}
          >
            <Text style={styles.cardTitle}>
              Play
              {countPlayDone === 1 ? (
                <Ionicons name="checkmark-circle" size={30} color="green" style={styles.tickIcon} />
              ) : (
                <Ionicons name="hourglass" size={30} color="white" style={styles.tickIcon} />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4B5563',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  cardContainer: {
    width: '80%',
  },
  card: {
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  blueCard: { backgroundColor: '#3B82F6' },
  pinkCard: { backgroundColor: '#F472B6' },
  cardTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
