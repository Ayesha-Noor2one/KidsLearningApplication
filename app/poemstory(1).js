import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

export default function FruitVegeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Link href="/StartScreen" style={styles.homeButton}>
          <FontAwesome name="home" size={24} color="white" />
        </Link>

        <Link href="/Settings" style={styles.settingsButton}>
          <FontAwesome name="cog" size={24} color="white" />
        </Link>

        <Text style={styles.title}>Poems and Stories</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.blueCard]}
            onPress={() => router.push('/Poems')}
          >
            <Text style={styles.cardTitle}>Poems</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.greenCard]}
            onPress={() => router.push('/stories')}
          >
            <Text style={styles.cardTitle}>Stories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4B5563',
    padding: 10,
    borderRadius: 50,
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#4B5563',
    padding: 10,
    borderRadius: 50,
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
    justifyContent: 'center', // Center vertically
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  blueCard: { backgroundColor: '#3B82F6' },
  greenCard: { backgroundColor: '#10B981' },
  pinkCard: { backgroundColor: '#F472B6' },
  cardTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});


