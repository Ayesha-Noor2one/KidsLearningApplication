import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AboutScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Background circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.card}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/Settings")}>
              <Ionicons name="arrow-back" size={24} color="#6C5CE7" />
            </TouchableOpacity>

            <Text style={styles.title}>About Us</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.subtitle}>
            Learning made fun, colorful, and magical!
          </Text>

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Kid's Learning App is more than just an app — it’s a safe, colorful,
              and interactive playground for curious little minds! Designed especially for
              toddlers and preschoolers, this app transforms everyday learning into exciting
              adventures. Whether your child is tracing letters, identifying shapes, or
              exploring the solar system, each screen is built to spark joy, build
              confidence, and encourage discovery through sound, animation, and hands-on
              interaction. Best part? It works offline, so learning never stops — even when
              Wi-Fi does!
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>✨ What's Inside?</Text>

            <View style={styles.listItem}>
              <FontAwesome5 name="font" size={20} color="#FF7675" />
              <Text style={styles.text}> Alphabet learning with pictures & sounds</Text>
            </View>

            <View style={styles.listItem}>
              <FontAwesome5 name="dice-six" size={20} color="#6C5CE7" />
              <Text style={styles.text}> Counting fun with animations</Text>
            </View>

            <View style={styles.listItem}>
              <Ionicons name="color-palette" size={20} color="#00C9A7" />
              <Text style={styles.text}> Colors, shapes & object recognition</Text>
            </View>

            <View style={styles.listItem}>
              <MaterialCommunityIcons name="fruit-cherries" size={20} color="#4D96FF" />
              <Text style={styles.text}> Fruits & vegetables flashcards</Text>
            </View>

            <View style={styles.listItem}>
              <FontAwesome5 name="book-open" size={20} color="#FF9F1C" />
              <Text style={styles.text}> Stories and poems</Text>
            </View>

            <View style={styles.listItem}>
              <FontAwesome5 name="brain" size={20} color="#845EC2" />
              <Text style={styles.text}> Memory & other games</Text>
            </View>

            <View style={styles.listItem}>
              <Ionicons name="planet" size={20} color="#00B4D8" />
              <Text style={styles.text}> Explore the solar system</Text>
            </View>

            <View style={styles.listItem}>
              <FontAwesome5 name="volume-up" size={20} color="#FF6B6B" />
              <Text style={styles.text}> Interactive sound learning</Text>
            </View>

            <View style={styles.listItem}>
              <MaterialCommunityIcons name="draw" size={20} color="#6BCB77" />
              <Text style={styles.text}> Tracing letters and numbers</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>👩‍💻 Developed By</Text>
            <Text style={styles.text}>
              An Information Technology student who’s passionate about building
              magical learning experiences for the tiniest learners on the planet 🌍✨
            </Text>
          </View>

        </View>

      </ScrollView>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9ff",
  },

  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 20,
    borderWidth: 4,
    borderColor: "#9183fa",
    elevation: 12,
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7675",
    flex: 1,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  section: {
    marginBottom: 24,
  },

  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6C5CE7",
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
    textAlign: "justify",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  text: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
});