import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  BackHandler,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { loginUser, getKidUsage } from "./database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kidName, setKidName] = useState("");
  const [role, setRole] = useState("PARENT");
  const [showPassword, setShowPassword] = useState(false);

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

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

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const validateForm = () => {
    if (!username || !password || (role === "kid" && !kidName)) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    return true;
  };

  const login = async () => {
    try {
      console.log(username);
      console.log(kidName);
      
      
      const res = await loginUser(username, password, kidName);
      console.log(res);
      
      if (res?.email === username && res?.role === "kid") {
        await AsyncStorage.setItem("userEmail", username);
        await AsyncStorage.setItem("kidName", kidName);
        console.log("KID ID "+res.id);
        
        await AsyncStorage.setItem("kidId", JSON.stringify(res.id));
        if (res.age == 5) return router.push("/five");
        if (res.age == 3) return router.push("/three");
        if (res.age == 4) return router.push("/four");

        

        router.push("/StartScreen");
        return;
      }

      if (res?.email === username && res?.role === "PARENT") {
        await AsyncStorage.setItem("userEmail", username);
        await AsyncStorage.setItem("parentId", JSON.stringify(res.id));
        router.push("/Settings");
        return;
      }

      Alert.alert("Account not found");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    login();
  };

  const handleExit = () => {
    Alert.alert("Exit Game", "Do you want to leave?", [
      { text: "Stay", style: "cancel" },
      { text: "Exit", onPress: () => BackHandler.exitApp() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <TouchableOpacity style={styles.backButton} onPress={handleExit}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.dotContainer}>
          <Animated.View style={[styles.dot, { backgroundColor: "#FFD93D", opacity: dot1 }]} />
          <Animated.View style={[styles.dotBig, { backgroundColor: "#6C5CE7", opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { backgroundColor: "#FF7675", opacity: dot3 }]} />
        </View>

        <Text style={styles.title}>Log In</Text>

        <View style={styles.roleSelector}>
          <Pressable onPress={() => setRole("PARENT")} style={[styles.roleButton, role === "PARENT" && styles.selectedRole]}>
            <Text style={styles.roleText}>Guardian</Text>
          </Pressable>

          <Pressable onPress={() => setRole("kid")} style={[styles.roleButton, role === "kid" && styles.selectedRole]}>
            <Text style={styles.roleText}>Kid</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          placeholder={role === "kid" ? "Guardian Email" : "Email"}
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder={role === "kid" ? "Kid Password" : "Password"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#6C5CE7" />
          </Pressable>
        </View>

        {role === "kid" && (
          <TextInput
            style={styles.input}
            placeholder="Kid Name"
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
          <Text style={styles.loginButtonText}>Log In</Text>
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

/* STYLES SAME */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9ff",
    justifyContent: "center",
    alignItems: "center",
  },
  circle1: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "#FFD93D", top: -50, left: -60, opacity: 0.35 },
  circle2: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "#6C5CE7", bottom: 80, right: -50, opacity: 0.2 },
  circle3: { position: "absolute", width: 130, height: 130, borderRadius: 65, backgroundColor: "#FF7675", top: 200, right: -20, opacity: 0.25 },

  backButton: { position: "absolute", top: 30, left: 20, backgroundColor: "#8373f9ff", padding: 12, borderRadius: 30 },

  card: { width: "90%", backgroundColor: "#fff", borderRadius: 35, padding: 25, alignItems: "center", borderWidth: 4, borderColor: "#a79cfcff" },

  dotContainer: { flexDirection: "row", marginBottom: 15 },
  dot: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 4 },
  dotBig: { width: 42, height: 42, borderRadius: 32, marginHorizontal: 4 },

  title: { fontSize: 28, fontWeight: "bold", color: "#FF7675", marginBottom: 20 },

  input: { backgroundColor: "#f4f6ff", borderRadius: 18, width: "100%", padding: 14, marginBottom: 15 },

  passwordContainer: { width: "100%", position: "relative" },
  eyeIcon: { position: "absolute", right: 15, top: 18 },

  forgotPassword: { color: "#6C5CE7", marginBottom: 20 },

  loginButton: { backgroundColor: "#ffdc51ff", padding: 15, width: "100%", borderRadius: 25, alignItems: "center", marginBottom: 20 },
  loginButtonText: { color: "#FF7675", fontSize: 18, fontWeight: "bold" },

  footerText: { color: "#555" },
  signUpText: { color: "#6C5CE7", fontWeight: "bold" },

  roleSelector: { flexDirection: "row", marginBottom: 18 },
  roleButton: { backgroundColor: "#a9aab0ff", padding: 12, borderRadius: 20, marginHorizontal: 8 },
  selectedRole: { backgroundColor: "#6C5CE7" },
  roleText: { color: "#fff", fontWeight: "bold" },
});