import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { send, EmailJSResponseStatus } from "@emailjs/react-native";
import { findByEmail, insertUser } from "./database";

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("PARENT");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit App", "Do you want to exit?", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const isValidEmail = (email) => {
    return /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(email);
  };

  const validateForm = () => {
    if (!name) return Alert.alert("Validation Error", "Name is required.");
    if (!email || !isValidEmail(email))
      return Alert.alert("Validation Error", "Please enter a valid email.");
    if (!password || password.length < 6)
      return Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters."
      );
    if (password !== confirmPassword)
      return Alert.alert("Validation Error", "Passwords do not match.");
    return true;
  };

  const handleInputChange = (setter) => (value) => setter(value);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmail = async () => {
    const otp = generateOTP();
    const otpGeneratedAt = Date.now();

    try {
      await send(
        "service_qmep2dp",
        "template_7haipk9",
        {
          name,
          email,
          message: "This is static message",
          otp,
        },
        { publicKey: "ucV02B72O55XZL_uf" }
      );

      return { otp, otpGeneratedAt };
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.warn("EmailJS error", err);
      }
      return null;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const payload = { name, email, password, role };
      const find = await findByEmail(payload.email);

      if (find?.email === email) {
        Alert.alert("Error", "Email already exists");
        setIsLoading(false);
        return;
      }

      if (email === "super@gmail.com") {
        const res = await insertUser(payload);

        if (res.changes === 1) {
          Alert.alert("Success", "Registration complete. Please log in.");
          router.replace("/Login");
        } else {
          Alert.alert("Error", "User could not be registered.");
        }
      } else {
        const result = await sendEmail();

        if (!result) {
          Alert.alert("Error", "Failed to send OTP.");
          setIsLoading(false);
          return;
        }

        const { otp, otpGeneratedAt } = result;

        Alert.alert("Success", "OTP sent!");

        router.push({
          pathname: "/OtpVerificationScreen",
          params: {
            otp,
            otpGeneratedAt,
            rest: JSON.stringify(payload),
            isEdit: false,
          },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Exit App", "Do you want to exit?", [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: () => BackHandler.exitApp() },
          ])
        }
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

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

        <View style={styles.inputContainer}>
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
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#6C5CE7"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={handleInputChange(setConfirmPassword)}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#6C5CE7" />
        ) : (
          <Pressable style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        )}

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Link href="/Login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Log in</Text>
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
    zIndex: 10,
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 30,
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7675",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#f4f6ff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#d9dcff",
  },

  inputContainer: {
    width: "100%",
    position: "relative",
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 18,
  },

  signUpButton: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  signUpButtonText: {
    color: "#FF7675",
    fontSize: 18,
    fontWeight: "bold",
  },

  footerText: {
    color: "#555",
  },

  loginLink: {
    color: "#6C5CE7",
    fontWeight: "bold",
  },
});