import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertUser } from './database';

export default function OtpVerification() {
  const navigation = useNavigation();
  const route = useRoute();

  const { otp, otpGeneratedAt, rest } = route.params;
  
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
      const payloadP=  JSON.parse(rest);   
      await register(payloadP);
    } else {
      Alert.alert('Invalid', 'The OTP you entered is incorrect.');
    }
  };

  const register = async (payload) => {
    try {       
        
      const res = await insertUser(payload);

      if (res.changes === 1) {
        Alert.alert('Success', 'Registration complete. Please log in.');
        navigation.navigate('Login'); // 👈 use screen name from your navigator
      } else {
        Alert.alert('Error', 'User could not be registered.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
