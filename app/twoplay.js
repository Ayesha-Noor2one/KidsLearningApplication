import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = width * 0.35;

export default function ThreeBigButtons() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/Ayesha-Noor2one/KidsLearningApplication/main/assets/images/mou.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/two")}
      >
        <Ionicons name="arrow-back" size={30} color="#8B0000" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.header}>PlayTime</Text>

        {/* Row with 2 buttons side by side */}
        <View style={styles.bottomRow}>
          {/* Left Button */}
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#FFB6C1" }]} // light pink
            onPress={() => router.push("/twocount")}
          >
            <Text style={styles.buttonText}>Play Count Game</Text>
          </TouchableOpacity>

          {/* Right Button */}
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#7FFFD4" }]} // aqua
            onPress={() => router.push("/twothis")}
          >
            <Text style={styles.buttonText}>Tap Circle Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
 container: {
  flex: 1,
  paddingTop: 80,
  alignItems: "center",
  justifyContent: "center", // ⬅️ center instead of space-between
  paddingBottom: 80,
},

  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    backgroundColor: "#0006",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  circleButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 12,
    elevation: 5,
  },
});
