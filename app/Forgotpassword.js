import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { findByEmail } from "./database";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const pop1 = useRef(new Animated.Value(0)).current;
  const pop2 = useRef(new Animated.Value(0)).current;
  const pop3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(pop1, 0);
    animate(pop2, 200);
    animate(pop3, 400);
  }, []);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const verifyEmail = async (email) => {
    try {
      const res = await findByEmail(email);
      if (res && res.email === email) {
        router.push({
          pathname: "/resetpassword",
          params: { email },
        });
      } else {
        Alert.alert("Email Not Found", "No account found with that email address.");
      }
    } catch (error) {
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

    
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

     
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/Login")}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>

       
        <View style={styles.iconRow}>
          <Animated.View style={[styles.bubble, {
            transform: [{ scale: pop1 }],
            backgroundColor: "#FFD93D",
          }]} />

          <Animated.View style={[styles.bubbleBig, {
            transform: [{ scale: pop2 }],
            backgroundColor: "#6C5CE7",
          }]} />

          <Animated.View style={[styles.bubble, {
            transform: [{ scale: pop3 }],
            backgroundColor: "#FF7675",
          }]} />
        </View>

        <Text style={styles.title}>Forgot Password ?🔐</Text>

        <Text style={styles.subtitle}>
          Enter your email to reset password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="youremail@example.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next </Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9ff",
    justifyContent: "center",
    alignItems: "center",
  },

 
  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFD93D",
    top: -50,
    left: -60,
    opacity: 0.35,
  },

  circle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6C5CE7",
    bottom: 80,
    right: -50,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FF7675",
    top: 200,
    right: -20,
    opacity: 0.25,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 30,
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#9183fa",
    elevation: 12,
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },

  bubble: {
    width: 25,
    height: 25,
    borderRadius: 15,
    marginHorizontal: 6,
  },

  bubbleBig: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#f4f6ff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#d9dcff",
  },

  button: {
    backgroundColor: "#FFD93D",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#FF7675",
    fontSize: 18,
    fontWeight: "bold",
  },
});