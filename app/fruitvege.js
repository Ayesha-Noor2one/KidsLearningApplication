import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FruitVegeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={{ uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg" }}
   style={styles.background}>
      <SafeAreaView style={styles.container}>
       
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.push('/learnandfun')}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Fruit and Vegetables</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.blueCard]}
            onPress={() => router.push('/Fruits')}
          >
            <Text style={styles.cardTitle}>Fruits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.greenCard]}
            onPress={() => router.push('/vege')}
          >
            <Text style={styles.cardTitle}>Vegetables</Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            style={[styles.card, styles.pinkCard]}
            onPress={() => router.push('/Guessfv')}
          >
            <Text style={styles.cardTitle}>Play</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 25,
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
  greenCard: { backgroundColor: '#10B981' },
  pinkCard: { backgroundColor: '#F472B6' },
  cardTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
