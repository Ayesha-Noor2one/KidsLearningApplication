import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateParent } from './database';

export default function UpdateVerification() {
  const navigation = useNavigation();
  const route = useRoute();

  const { otp, otpGeneratedAt, rest, isEdit } = route.params;

  const [enteredOtp, setEnteredOtp] = useState('');

  const handleVerify = async () => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - otpGeneratedAt > fiveMinutes) {
      Alert.alert('Expired', 'Your OTP has expired. Please try again.');
      navigation.goBack(); // or navigate to resend OTP
      return;
    }

    if (enteredOtp === otp) {
      const payloadP = JSON.parse(rest);
      await update(payloadP);
    } else {
      Alert.alert('Invalid', 'The OTP you entered is incorrect.');
    }
  };

  const update = async (payload) => {
    try {

      const res = await updateParent(payload);
      if (res.changes === 1) {
        Alert.alert('Success', 'Update complete. Please log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert("Error", "No changes made.");
      }
    } catch (error) {
      console.error('Error during update of paent:', error);
      Alert.alert('Error', error.message || 'An error occurred.');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Enter the OTP sent to your email</Text>
      <TextInput
        keyboardType="numeric"
        value={enteredOtp}
        onChangeText={setEnteredOtp}
        placeholder="Enter OTP"
        maxLength={6}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 16,
          borderRadius: 6,
        }}
      />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
}
