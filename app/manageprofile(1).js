import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null); // Default to null for no image
  const [email, setEmail] = useState("youremail@gmail.com");
  const [password, setPassword] = useState(".....");
  const [phone, setPhone] = useState("0302......");
  const [age, setAge] = useState("3");

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri); // Update profile image
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri); // Update profile image
    }
  };

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/Settings" asChild>
          <Button textColor="#8b0000">Cancel</Button>
        </Link>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Link href="/Settings" asChild>
          <Button onPress={handleSave} textColor="#8b0000">Save</Button>
        </Link>
      </View>

      <View style={styles.imageWrapper}>
        {/* Show person icon if no image is selected, otherwise display selected image */}
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person" size={170} color="#8b0000" /> // Default person icon
        )}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image" size={30} color="#8b0000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto}>
            <Ionicons name="camera" size={30} color="#8b0000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>YOUR EMAIL</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#8b0000" />

        <Text style={styles.label}>YOUR PASSWORD</Text>
        <TextInput style={styles.input} value={password} secureTextEntry onChangeText={setPassword} placeholderTextColor="#8b0000" />

        <Text style={styles.label}>YOUR PHONE</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="numeric" placeholderTextColor="#8b0000" />

        <Text style={styles.label}>AGE</Text>
        <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor="#8b0000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffd700", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#8b0000" },
  imageWrapper: { alignItems: "center", marginVertical: 20 },
  profileImage: { width: 170, height: 170, borderRadius: 50 },
  iconContainer: { flexDirection: "row", justifyContent: "center", marginTop: 10, gap: 15 },
  inputContainer: { marginTop: 10 },
  label: { fontSize: 20, color: "#8b0000", fontWeight:"bold", marginTop: 10 },
  input: { borderBottomWidth: 1, borderColor: "#8b0000", fontSize: 16, paddingVertical: 5, color: "#8b0000" },
});

export default EditProfileScreen;
