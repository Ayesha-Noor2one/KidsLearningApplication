import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import bgMusic from '../assets/sounds/a.mp3';
import * as Notifications from 'expo-notifications';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BORDER_COLOR = '#8B0000'; // Dark red
const CARD_BG = '#FFD700';      // Gold

export default function SettingsScreen() {
    const router = useRouter();
    const [musicOn, setMusicOn] = useState(false);
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [usageLimit, setUsageLimit] = useState(30);
    const soundRef = useRef(new Audio.Sound());
    const [soundLoaded, setSoundLoaded] = useState(false);

    // Load & start music on mount
    useEffect(() => {

        Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

        const askNotificationPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Notification permissions not granted!');
            }
        };

        askNotificationPermission();



        let isMounted = true;
        const loadAndPlay = async () => {
            try {
                await soundRef.current.loadAsync(
                    bgMusic,
                    { shouldPlay: true, isLooping: true, volume: 0.5 }
                );
                if (isMounted) setSoundLoaded(true);
            } catch (e) {
                console.warn('Error loading sound', e);
            }
        };
        loadAndPlay();

        return () => {
            isMounted = false;
            soundRef.current.unloadAsync();
        };
    }, []);

    // Play / pause based on musicOn
    useEffect(() => {
        if (!soundLoaded) return;
        (async () => {
            try {
                if (musicOn) {
                    await soundRef.current.playAsync();
                } else {
                    await soundRef.current.pauseAsync();
                }
            } catch (e) {
                console.warn('Error toggling sound', e);
            }
        })();
    }, [musicOn, soundLoaded]);

   const toggleMusic = async () => {
  if (soundLoaded) setMusicOn(prev => !prev);

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    alert('Notification permission not granted');
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎵 khota!',
        body: 'Let’s turn the music back on and play!',
        sound: 'default',
      },
      trigger: {
    type: 'date',
    timestamp: new Date(Date.now() + 10 * 1000), // 20 seconds from now
  },
    });
  } catch (error) {
    console.warn('Notification error:', error);
  }
};



    async function requestPermission() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission not granted!');
        }
    }
    const toggleNotifications = () => setNotificationsOn(n => !n);
    const increaseLimit = () => setUsageLimit(u => u + 5);
    const decreaseLimit = () => setUsageLimit(u => Math.max(0, u - 5));

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backIcon}
                onPress={() => router.back()}
            >
                <FontAwesome name="arrow-left" size={24} color={BORDER_COLOR} />
            </TouchableOpacity>

            <Text style={styles.header}>SETTINGS*</Text>

            <View style={styles.card}>
                {/* Background Music */}
                <View style={styles.row}>
                    <Text style={styles.label}>Background Music</Text>
                    <Pressable
                        style={[styles.toggleButton, musicOn ? styles.on : styles.off]}
                        onPress={toggleMusic}
                    >
                        <FontAwesome name="music" size={20} color="#fff" />
                        <Text style={styles.toggleText}>{musicOn ? 'On' : 'Off'}</Text>
                    </Pressable>
                </View>

                {/* Notifications */}
                <View style={styles.row}>
                    <Text style={styles.label}>Notifications</Text>
                    <Pressable
                        style={[styles.toggleButton, notificationsOn ? styles.on : styles.off]}
                        onPress={toggleNotifications}
                    >
                        <FontAwesome
                            name={notificationsOn ? 'bell' : 'bell-slash'}
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.toggleText}>
                            {notificationsOn ? 'On' : 'Off'}
                        </Text>
                    </Pressable>
                </View>

                {/* App Usage Limit */}
                <View style={styles.row}>
                    <Text style={styles.label}>App Usage Limit</Text>
                    <View style={styles.usageContainer}>
                        <Pressable style={styles.limitButton} onPress={decreaseLimit}>
                            <Text style={styles.limitText}>–</Text>
                        </Pressable>
                        <Text style={styles.usageText}>{usageLimit} min</Text>
                        <Pressable style={styles.limitButton} onPress={increaseLimit}>
                            <Text style={styles.limitText}>+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 2,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: BORDER_COLOR,
        marginBottom: 30,
        textDecorationLine: 'underline',
    },
    card: {
        width: SCREEN_WIDTH - 20,
        backgroundColor: CARD_BG,
        borderColor: BORDER_COLOR,
        borderWidth: 3,
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: BORDER_COLOR,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    on: {
        backgroundColor: '#4CAF50',
    },
    off: {
        backgroundColor: '#F44336',
    },
    toggleText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 8,
        fontWeight: '500',
    },
    usageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    limitButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    limitText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
    },
    usageText: {
        fontSize: 20,
        color: BORDER_COLOR,
        minWidth: 60,
        textAlign: 'center',
        fontWeight: '500',
    },
});
