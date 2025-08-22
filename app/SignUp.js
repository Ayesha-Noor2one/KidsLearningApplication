import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(email);
  };

  const validateForm = () => {
    if (!name) return Alert.alert("Validation Error", "Name is required.");
    if (!email || !isValidEmail(email)) return Alert.alert("Validation Error", "Please enter a valid email.");
    if (!password || password.length < 6) return Alert.alert("Validation Error", "Password must be at least 6 characters.");
    if (password !== confirmPassword) return Alert.alert("Validation Error", "Passwords do not match.");
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
        {
          publicKey: "ucV02B72O55XZL_uf"
        }
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
        Alert.alert("Email already exists");
        return;
      }

      const result = await sendEmail();
      if (!result) throw new Error("Failed to send OTP");

      const { otp, otpGeneratedAt } = result;
      router.push({
        pathname: "/OtpVerificationScreen",
        params: { otp, otpGeneratedAt, rest: JSON.stringify(payload),isEdit:false },
      });
    } catch (error) {
      console.error("Error during sign-up:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleInputChange(setName)}
          placeholder="Name"
          placeholderTextColor="#FFD700"
        />

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleInputChange(setEmail)}
          placeholder="Email"
          placeholderTextColor="#FFD700"
          keyboardType="email-address"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handleInputChange(setPassword)}
            placeholder="Password"
            placeholderTextColor="#FFD700"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={22} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={handleInputChange(setConfirmPassword)}
            placeholder="Confirm Password"
            placeholderTextColor="#FFD700"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={22} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#8B0000" />
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
    borderWidth: 3,
    borderColor: "#8B0000",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#8B0E0E",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 20,
  },
  signUpButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
    textDecorationLine: "underline",
  },
});
