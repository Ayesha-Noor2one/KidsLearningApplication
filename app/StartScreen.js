import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.42;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/mou.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/AHome')}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        {/* Cartoon Dog Icon */}
        <View style={styles.dogContainer}>
          <Image
            source={require('../assets/images/DOG (1).png')}
            style={styles.dogImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Kids!</Text>

        {/* Buttons Layout */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: '#FF69B4' }]}
            onPress={() => router.push('/learnandfun')}
          >
            <FontAwesome name="smile-o" size={30} color="#FFFFFF" />
            <Text style={styles.circleButtonText}>Learn & Fun</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: '#20B2AA' }]}
            onPress={() => router.push('/playTime')}
          >
            <FontAwesome name="gamepad" size={30} color="#FFFFFF" />
            <Text style={styles.circleButtonText}>Play Time</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.circleButton, styles.bottomButton, { backgroundColor: '#FFD700' }]}
          onPress={() => router.push('/rewards')}
        >
          <FontAwesome name="star" size={30} color="#FFFFFF" />
          <Text style={styles.circleButtonText}>View Rewards</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4B5563',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  dogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  dogImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 40,
    fontFamily: 'Consolas',
    backgroundColor: '#FFFFFFAA',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  circleButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    padding: 10,
  },
  bottomButton: {
    marginTop: 10,
  },
  circleButtonText: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Consolas',
    textAlign: 'center',
    color: '#8B0000',
  },
});
