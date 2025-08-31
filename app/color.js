import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ColorsScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/images/mou.jpg')} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        {/* Back Icon */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate('learnandfun')}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.heading}>
          <Text style={{ color: 'red' }}>C</Text>
          <Text style={{ color: 'orange' }}>O</Text>
          <Text style={{ color: 'yellow' }}>L</Text>
          <Text style={{ color: 'green' }}>O</Text>
          <Text style={{ color: 'blue' }}>R</Text>
          <Text style={{ color: 'purple' }}>S</Text>
        </Text>

        {/* Buttons */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.blueCard]}
            onPress={() => navigation.navigate('learncolor')}>
            <Text style={styles.cardTitle}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.greenCard]}
            onPress={() => navigation.navigate('Guesscolor')}>
            <Text style={styles.cardTitle}>Play</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 25,
  },
  heading: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardContainer: {
    width: '80%',
  },
  card: {
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  blueCard: { backgroundColor: '#3B82F6' },
  greenCard: { backgroundColor: '#10B981' },
  cardTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
