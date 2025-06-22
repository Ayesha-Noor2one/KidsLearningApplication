import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const navigation = useNavigation();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const togglePush = () => setPushEnabled(prev => !prev);
  const toggleEmail = () => setEmailEnabled(prev => !prev);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  const goToSettings = () => navigation.navigate('SettingsScreen');

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goToSettings}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Notifications</Text>

      {/* Toggle Options */}
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={pushEnabled} onValueChange={togglePush} />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Email Notifications</Text>
        <Switch value={emailEnabled} onValueChange={toggleEmail} />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Sound Effects</Text>
        <Switch value={soundEnabled} onValueChange={toggleSound} />
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={goToSettings}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fdfdfd',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 18,
  },
  doneButton: {
    marginTop: 40,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
