import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧠 Kids Learning App</Text>
      <Text style={styles.subtitle}>Learning made fun, colorful, and magical!</Text>

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
          <FontAwesome5 name="font" size={20} color="#FF6B6B" />
          <Text style={styles.text}> Alphabet learning with pictures & sounds</Text>
        </View>
        <View style={styles.listItem}>
          <FontAwesome5 name="dice-six" size={20} color="orange" />
          <Text style={styles.text}> Counting fun with animations</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="color-palette" size={20} color="#6BCB77" />
          <Text style={styles.text}> Colors, shapes & object recognition</Text>
        </View>
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="fruit-cherries" size={20} color="#4D96FF" />
          <Text style={styles.text}> Fruits & vegetables flashcards</Text>
        </View>
        <View style={styles.listItem}>
          <FontAwesome5 name="book-open" size={20} color="#FF6B6B" />
          <Text style={styles.text}> Stories and poems</Text>
        </View>
        <View style={styles.listItem}>
          <FontAwesome5 name="brain" size={20} color="orange" />
          <Text style={styles.text}> Memory & other games</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="planet" size={20} color="#6BCB77" />
          <Text style={styles.text}> Explore the solar system</Text>
        </View>
        <View style={styles.listItem}>
          <FontAwesome5 name="volume-up" size={20} color="#4D96FF" />
          <Text style={styles.text}> Interactive sound learning</Text>
        </View>
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="draw" size={20} color="#FF6B6B" />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3E38D',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4D96FF',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    textAlign: 'justify',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
});

export default AboutScreen;


