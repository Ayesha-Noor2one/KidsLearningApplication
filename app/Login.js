import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { loginUser, findImageByEmail } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kidName, setKidName] = useState("");
  const [role, setRole] = useState("PARENT");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!username || !password || (role === "kid" && !kidName)) {
      Alert.alert("Validation Error", "All fields are required.", [{ text: "OK" }]);
      return false;
    }
    return true;
  };

  const login = async (username, password, kidName) => {
    try {
      const res = await loginUser(username, password, kidName);
      if (res?.email === username && res?.role === 'kid') {
        await AsyncStorage.setItem('userEmail', username);
        await AsyncStorage.setItem('kidName', kidName);
        await AsyncStorage.setItem('kidId', JSON.stringify(res.id));
        router.push("/StartScreen");
        return;
      }

      if (res?.email === username && res?.role === 'PARENT') {
        await AsyncStorage.setItem('userEmail', username);
        router.push("/Settings");
        return;
      }

      Alert.alert("Account not found");
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    login(username, password, kidName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/DOG (1).png")}
          style={styles.image}
        />

        <Text style={styles.title}>Log In</Text>

        <View style={styles.roleSelector}>
          <Pressable
            style={[styles.roleButton, role === "PARENT" && styles.selectedRole]}
            onPress={() => setRole("PARENT")}
          >
            <Text style={styles.roleText}>Guardian</Text>
          </Pressable>
          <Pressable
            style={[styles.roleButton, role === "kid" && styles.selectedRole]}
            onPress={() => setRole("kid")}
          >
            <Text style={styles.roleText}>Kid</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          placeholder={role === "kid" ? "Guardian Email" : "Email"}
          placeholderTextColor="#FFD700"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder={role === "kid" ? "Kid Password" : "Password"}
            placeholderTextColor="#FFD700"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#FFD700" />
          </Pressable>
        </View>

        {role === "kid" && (
          <TextInput
            style={styles.input}
            placeholder="Kid Name"
            placeholderTextColor="#FFD700"
            value={kidName}
            onChangeText={setKidName}
          />
        )}

        <Link href="/Forgotpassword" asChild>
          <Pressable>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
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
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderColor: "#8B0000",
    borderWidth: 3,
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
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 18,
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
  roleSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#8B0000",
    backgroundColor: "#8B0000",
    borderRadius: 20,
  },
  roleText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
