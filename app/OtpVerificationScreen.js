import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { insertUser } from "./database";

export default function OtpVerification() {
  const navigation = useNavigation();
  const route = useRoute();

  const { otp, otpGeneratedAt, rest } = route.params;

  const [enteredOtp, setEnteredOtp] = useState("");

  /* 🎈 animations (same app style) */
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

  const handleVerify = async () => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - otpGeneratedAt > fiveMinutes) {
      Alert.alert("Expired", "Your OTP has expired. Please try again.");
      navigation.goBack();
      return;
    }

    if (enteredOtp === otp) {
      const payloadP = JSON.parse(rest);
      await register(payloadP);
    } else {
      Alert.alert("Invalid", "The OTP you entered is incorrect.");
    }
  };

  const register = async (payload) => {
    try {
      const res = await insertUser(payload);

      if (res.changes === 1) {
        Alert.alert("Success", "Registration complete. Please log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "User could not be registered.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    }
  };

  return (
    <View style={styles.container}>

      {/* BACK BUTTON → SIGNUP */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      {/* BACKGROUND CIRCLES */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <View style={styles.card}>

        {/* animated bubbles */}
        <View style={styles.iconRow}>
          <Animated.View style={[styles.bubble, { transform: [{ scale: pop1 }] }]} />
          <Animated.View style={[styles.bubbleBig, { transform: [{ scale: pop2 }] }]} />
          <Animated.View style={[styles.bubble, { transform: [{ scale: pop3 }] }]} />
        </View>

        <Text style={styles.title}>OTP Verification 🔐</Text>

        <Text style={styles.subtitle}>
          Enter the OTP sent to your email
        </Text>

        <TextInput
          keyboardType="numeric"
          value={enteredOtp}
          onChangeText={setEnteredOtp}
          placeholder="Enter OTP"
          maxLength={6}
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify OTP 🚀</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* THEME MATCHED STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9ff",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 30,
    zIndex: 10,
  },

  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFD93D",
    top: -50,
    left: -60,
    opacity: 0.3,
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

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 25,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#9183fa",
    elevation: 14,
  },

  iconRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  bubble: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#FFD93D",
    marginHorizontal: 4,
  },

  bubbleBig: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6C5CE7",
    marginHorizontal: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
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
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 6,
  },

  button: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
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