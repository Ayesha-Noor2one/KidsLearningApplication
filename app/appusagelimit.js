import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UsageLimitScreen = () => {
  const [usageTime, setUsageTime] = useState(0); // total usage time in seconds
  const [isLimitReached, setIsLimitReached] = useState(false);
  const usageLimit = 3600; // 1 hour limit in seconds

  useEffect(() => {
    const checkUsage = async () => {
      const storedTime = await AsyncStorage.getItem('usageTime');
      const currentTime = Date.now() / 1000; // current time in seconds

      if (storedTime) {
        const usage = currentTime - parseFloat(storedTime);
        setUsageTime(usage);
        if (usage >= usageLimit) {
          setIsLimitReached(true);
        }
      } else {
        await AsyncStorage.setItem('usageStartTime', currentTime.toString());
      }
    };

    const interval = setInterval(checkUsage, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const resetUsageTime = async () => {
    await AsyncStorage.removeItem('usageTime');
    await AsyncStorage.removeItem('usageStartTime');
    setUsageTime(0);
    setIsLimitReached(false);
  };

  const displayRemainingTime = () => {
    const remainingTime = usageLimit - usageTime;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    return `${minutes}m ${seconds}s remaining`;
  };

  if (isLimitReached) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usage Limit Reached</Text>
        <Text style={styles.message}>You have reached your daily usage limit of 1 hour.</Text>
        <Button title="Reset Usage" onPress={resetUsageTime} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Usage Tracker</Text>
      <Text style={styles.message}>
        {usageTime > 0 ? displayRemainingTime() : 'Tracking usage...'}
      </Text>
      <Button title="Reset Usage" onPress={resetUsageTime} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default UsageLimitScreen;
