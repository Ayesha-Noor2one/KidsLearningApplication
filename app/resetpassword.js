import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { updatePassword } from "./database";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const route = useRoute();
  const { email } = useLocalSearchParams();

 
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

  const updatePasswords = async (payload) => {
    try {
      await updatePassword(payload);
      Alert.alert("Success", "Password changed successfully!");
      router.push("/Login");
    } catch (error) {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Both fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const payload = {
      email,
      password: newPassword,
    };
    updatePasswords(payload);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

        
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/Forgotpassword")}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

        
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />

          <View style={styles.box}>

           
            <View style={styles.iconRow}>
              <Animated.View style={[styles.bubble, { transform: [{ scale: pop1 }] }]} />
              <Animated.View style={[styles.bubbleBig, { transform: [{ scale: pop2 }] }]} />
              <Animated.View style={[styles.bubble, { transform: [{ scale: pop3 }] }]} />
            </View>


            <Text style={styles.title}>Reset Password 🔐</Text>

           
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create new password"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6C5CE7"
                />
              </TouchableOpacity>
            </View>

           
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6C5CE7"
                />
              </TouchableOpacity>
            </View>

            <Pressable style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Update </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


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

  box: {
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

  image: {
    width: 170,
    height: 170,
    marginBottom: 10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6ff",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    borderWidth: 2,
    borderColor: "#d9dcff",
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
  },

  icon: {
    paddingLeft: 10,
  },

  button: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FF7675",
    fontSize: 18,
    fontWeight: "bold",
  },
});