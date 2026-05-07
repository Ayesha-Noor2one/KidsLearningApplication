import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { send, EmailJSResponseStatus } from "@emailjs/react-native";
import { findByEmail, updateParent } from "./database";

const EditProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userEmail = await AsyncStorage.getItem('userEmail');
      const res = await findByEmail(userEmail);
      if (res) {
        setName(res.name || '');
        setEmail(res.email || '');
        setPassword(res.password || '');
        setId(res.id || '');
        setOriginalEmail(res.email || '');
      }
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleInputChange = (setter) => (value) => setter(value);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!name.trim()) return Alert.alert("Validation Error", "Name cannot be empty");
    if (!email.trim()) return Alert.alert("Validation Error", "Email cannot be empty");
    if (!isValidEmail(email)) return Alert.alert("Validation Error", "Enter valid email");
    if (!password) return Alert.alert("Validation Error", "Password cannot be empty");
    if (password.length < 6) return Alert.alert("Validation Error", "Min 6 characters");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = { id, name, email, password };

      if (email !== originalEmail) {
        const existing = await findByEmail(email);
        if (existing && existing.id !== id) {
          Alert.alert("Email already exists");
          return;
        }

        const otp = generateOTP();
        const otpGeneratedAt = Date.now();

        router.push({
          pathname: "/updateVerification",
          params: {
            otp,
            otpGeneratedAt,
            rest: JSON.stringify(payload),
            isEdit: true
          },
        });
      } else {
        await updateParent(payload);
        Alert.alert("Success", "Profile updated successfully.");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <View style={styles.card}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/Settings")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Manage Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleInputChange(setName)}
          placeholder="Name"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleInputChange(setEmail)}
          placeholder="Email"
          placeholderTextColor="#999"
        />

        {/* ✅ FIXED PASSWORD FIELD */}
        <View style={styles.passwordBox}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handleInputChange(setPassword)}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#6C5CE7"
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6C5CE7" />
        ) : (
          <>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#f7f9ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  circle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFD93D",
    top: -40,
    left: -50,
    opacity: 0.3,
  },

  circle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#6C5CE7",
    bottom: 80,
    right: -40,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF7675",
    top: 200,
    right: -20,
    opacity: 0.2,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 25,
    borderWidth: 4,
    borderColor: "#9183fa",
    elevation: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backBtn: {
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 25,
    left:-20,
    bottom:200,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF7675",
  },

  input: {
    width: "100%",
    backgroundColor: "#f4f6ff",
    padding: 14,
    paddingRight: 45,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#d9dcff",
  },

  passwordBox: {
    position: "relative",
    width: "100%",
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 14,
  },

  saveBtn: {
    backgroundColor: "#FFD93D",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#FF7675",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelBtn: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#6C5CE7",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  cancelText: {
    color: "#6C5CE7",
    fontWeight: "bold",
  },
});