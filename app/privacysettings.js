import React, { useState } from 'react';
import { View, Text, Switch, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const Privacy = () => {
  const [isDataSharingEnabled, setDataSharingEnabled] = useState(false);
  const [isPrivacyModeEnabled, setPrivacyModeEnabled] = useState(false);

  const navigation = useNavigation();

  // Toggle Data Sharing
  const toggleDataSharing = () => {
    setDataSharingEnabled(previousState => !previousState);
  };

  // Toggle Privacy Mode
  const togglePrivacyMode = () => {
    setPrivacyModeEnabled(previousState => !previousState);
  };

  // Navigate to settings page
  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      {/* Privacy Mode Option */}
      <Text style={styles.title}>Privacy Mode</Text>
      <View style={styles.switchContainer}>
        <Text>Enable Privacy Mode</Text>
        <Switch
          value={isPrivacyModeEnabled}
          onValueChange={togglePrivacyMode}
        />
      </View>

      {/* Data Sharing Option */}
      <Text style={styles.title}>Data Sharing</Text>
      <View style={styles.switchContainer}>
        <Text>Enable Data Sharing</Text>
        <Switch
          value={isDataSharingEnabled}
          onValueChange={toggleDataSharing}
        />
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        {/* Arrow Button to go to Settings */}
        <TouchableOpacity style={styles.arrowButton} onPress={goToSettings}>
          <Text style={styles.arrowButtonText}>←</Text>
        </TouchableOpacity>

        {/* Done Button that links to Settings */}
        <Button title="Done" onPress={goToSettings} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  arrowButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
  },
  arrowButtonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Privacy;
