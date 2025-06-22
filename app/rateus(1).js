import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RateUsScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation();

  const handleRate = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Oops!", "Please select a star rating before submitting.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      Alert.alert("Thanks!", "Your feedback helps us grow 🌱");
      setComment('');
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Home Icon */}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('StartScreen')}>
        <AntDesign name="home" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🌟 Enjoying the Learning Fun?</Text>
      <Text style={styles.subtitle}>
        We'd love to take your feedback! Please take a moment to rate and review our app.
        Your feedback helps us improve and serve you better.
      </Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRate(star)}>
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color="#FFD93D"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.commentBox}
        placeholder="Leave a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {submitted && (
        <Text style={styles.thankyou}>💖 Thank you for your support!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E38D',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 8,
    color: '#FF6347',
  },
  commentBox: {
    width: '90%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  thankyou: {
    fontSize: 16,
    color: '#6BCB77',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RateUsScreen;
