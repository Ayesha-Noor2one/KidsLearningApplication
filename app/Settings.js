import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findByEmail } from './database';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 80) / 3;

const Settings = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        setUsername(storedEmail || '');
        const res = await findByEmail(storedEmail);
        setName(res.name);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfile();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.username}>
            🎉 Welcome{name ? `, ${name}` : ''}
          </Text>

          <Text style={styles.title}>Dashboard</Text>

          <View style={styles.grid}>
            <SettingsTile icon="user" text="Profile" href="/manageprofile" />
            <SettingsTile icon="child" text="Children" href="/manageChildren" />
            <SettingsTile icon="sign-out" text="Logout" href="/Login" />
            <SettingsTile icon="line-chart" text="Progress" href="/childrenProgress" />
            <SettingsTile icon="cogs" text="Settings" href="/appsettings" />
            <SettingsTile icon="info-circle" text="About" href="/about" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const SettingsTile = ({ icon, text, href }) => {
  const router = useRouter();

  const handlePress = () => {
    if (text === 'Logout') {
      Alert.alert(
        'Logout Confirmation',
        'Are you sure you want to log out?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => router.replace(href) },
        ],
        { cancelable: true }
      );
    } else {
      router.push(href);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.tile}>
        <FontAwesome name={icon} size={22} color="#FFD700" />
        <Text style={styles.tileText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#fffefa',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderColor: '#8B0000',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: '95%',
  },
  username: {
    fontSize: 18,
    color: '#8B0000',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Consolas',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
    fontFamily: 'Consolas',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#8B0000',
    borderRadius: 16,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  tileText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Consolas',
  },
});

export default Settings;
