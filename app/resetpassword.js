import React, { useState } from "react";
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
} from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { updatePassword } from './database';
import { Ionicons } from "@expo/vector-icons";

import resetImage from "../assets/images/6321602 (4).png";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const route = useRoute();
  const { email } = useLocalSearchParams();

  const updatePasswords = async (payload) => {
    try {
      await updatePassword(payload);
      Alert.alert("Success", "Password changed successfully!");
      router.push("/Login");
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Both fields are required.");
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
          <View style={styles.box}>
            <Image source={resetImage} style={styles.image} />

            <Text style={styles.title}>Reset Password</Text>

            {/* New Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create new password"
                placeholderTextColor="#FFD700"
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
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#FFD700"
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
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
            </View>

            <Pressable style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Update</Text>
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
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  box: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    width: "90%",
    minHeight: 600,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#8B0000",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B0000",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    color: "#FFD700",
    fontSize: 16,
    paddingVertical: 12,
  },
  icon: {
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
