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
import { findByEmail, updateParent } from './database';
import { useRouter } from "expo-router";

const EditProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState('');
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
      }
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (value) => setter(value);

  const handleSave = async () => {
    try {
      const payload = { id, name, email, password };
      const res = await updateParent(payload);
      if (res.changes === 1) {
        Alert.alert("Success", "Profile updated successfully!", [
          { text: "OK", onPress: () => router.push("/Settings") }
        ]);
      } else {
        Alert.alert("Error", "No changes made.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Manage Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleInputChange(setName)}
            placeholder="Name"
            placeholderTextColor="#FFD700"
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleInputChange(setEmail)}
            placeholder="Email"
            placeholderTextColor="#FFD700"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={handleInputChange(setPassword)}
              placeholder="Password"
              placeholderTextColor="#FFD700"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#FFD700"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8B0000" />
        ) : (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: "#8B0000",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#8B0000",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#8B0E0E",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -35,
  },
  saveButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  cancelButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#8B0000",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
  },
});

export default EditProfileScreen;
