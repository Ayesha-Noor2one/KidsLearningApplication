import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function StartScreen2() {
  const router = useRouter();

  const moveToLogin = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('kidName');
    router.push("/Login");
  };

  return (
    <ImageBackground
      source={require("../assets/images/scenery.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <Pressable onPress={moveToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.mainButtonsContainer}>
          <View style={styles.row}>
            <CustomLink title="Alphabets" icon="book-outline" href="/Alphabets" />
            <CustomLink title="Counting" icon="calculator-outline" href="/Counting" />
            <CustomLink title="Shapes" icon="shapes-outline" href="/shapes" />
          </View>

          <View style={styles.row}>
            <CustomLink title="Fruits & Vegetables" icon="nutrition-outline" href="/fruitvege" />
            <CustomLink title="Colors" icon="color-palette-outline" href="/color" />
            <CustomLink title="Body Parts" icon="body-outline" href="/bodyparts" />
          </View>

          <View style={styles.row}>
            <CustomLink title="Solar System" icon="planet-outline" href="/solarsystem" />
            <CustomLink title="Poems & Stories" icon="bookmarks-outline" href="/poemstory" />
            <CustomLink title="Memory Games" icon="game-controller-outline" href="/memorygames" />
          </View>

          <View style={styles.row}>
            <CustomLink title="Whack a Mole" icon="cube-outline" href="/BlockGames" />
            {/* Removed Daily Progress tile */}
            <CustomLink title="Rewards" icon="gift-outline" href="/Rewards" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const CustomLink = ({ title, icon, href }) => (
  <Link href={href} asChild>
    <Pressable style={styles.button}>
      <Ionicons name={icon} size={24} color="#FFD700" />
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainButtonsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  button: {
    width: width * 0.28,
    height: 80,
    backgroundColor: "#8B0000",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    marginTop: 5,
  },
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
    marginLeft: 5,
  },
});
