import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { loginUser} from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Logout() {
  const router = useRouter(); // useRouter hook for manual navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    const fetchProfileData = async () => {
      await AsyncStorage.removeItem('userEmail');
      router.push("/AHome");
    };

    fetchProfileData();
  }, []);
  const login = async (username,password) => {
    try {
          const res = await loginUser(username,password);
          if (res.email == username) {
            await AsyncStorage.setItem('userEmail', username);
            router.push("/Welcome");
          }
        } catch (error) {
          console.error('Error posting data:', error); // Handle any errors here
        }
  };

  const handleLogin = () => {
    try {
      const payload = {
        email: username,
        password
      };
      login(username,password);
    } catch (error) {
      console.error("Error during sign-up:", error);

    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header Image */}
        <Image
          source={require("../assets/images/DOG (1).png")}
          style={styles.image}
        />

        {/* Title */}
        <Text style={styles.title}>Log In</Text>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#FFD700"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFD700"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Forgot Password */}
        <Link href="/Forgotpassword" asChild>
          <Pressable>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
        </Link>

        {/* Log In Button (Fixed) */}
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </Pressable>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Don't have an account? {" "}
          <Link href="/SignUp" asChild>
            <Pressable>
              <Text style={styles.signUpText}>Sign up</Text>
            </Pressable>
          </Link>
        </Text>
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
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 350,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Consolas",
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 30,
    textAlign: "center",
    textDecorationLine: "underline",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#8B0E0E",
    color: "#FFD700",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Consolas",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#8B0000",
  },
  forgotPassword: {
    color: "#8B0000",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Consolas",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontFamily: "Consolas",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footerText: {
    color: "#8B0000",
    fontSize: 16,
    fontFamily: "Consolas",
    textAlign: "center",
  },
  signUpText: {
    color: "#8B0000",
    fontWeight: "bold",
    fontFamily: "Consolas",
    textDecorationLine: "underline",
  },
});
