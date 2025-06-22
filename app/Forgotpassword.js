import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { findByEmail } from './database';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const verifyEmail = async (email) => {
    try {
      const res = await findByEmail(email);
      if (res && res.email === email) {
        router.push({
          pathname: '/resetpassword',
          params: { email },
        });
      } else {
        Alert.alert("Email Not Found", "No account found with that email address.");
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handleContinue = () => {
    if (!email.trim()) {
      Alert.alert("Empty Field", "Please enter your email.");
    } else if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
    } else {
      verifyEmail(email);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../assets/images/cat.png")} style={styles.image} />

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email address to reset your password.</Text>

        <TextInput
          style={styles.input}
          placeholder="youremail@example.com"
          placeholderTextColor="#FFD700"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    minHeight: 520,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#8B0000",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  image: {
    width: 225,
    height: 225,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Consolas",
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Consolas",
    color: "#8B0000",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#8B0E0E",
    color: "#FFD700",
    fontSize: 16,
    fontFamily: "Consolas",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFD700",
    fontSize: 16,
    fontFamily: "Consolas",
    fontWeight: "bold",
  },
});
