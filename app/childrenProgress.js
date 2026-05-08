import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { findAllByKidId, findAllByEmail, findById } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProgressList = () => {
  const [progressData, setProgressData] = useState([]);
  const router = useRouter();

  // AGE 3 MODULES
  const modules3 = [
    "Alphabets Quiz",
    "Color Quiz",
    "Shape Quiz",
    "Count Quiz",
    "Habit Quiz",
    "Match Quiz"
  ];

  //  AGE 4 MODULES
  const modules4 = [
    "Alphabets Quiz",
    "Count Quiz",
    "Fruit Quiz",
    "Word Quiz",
    "Animal Quiz",
    "Pattern Quiz"
  ];

  //  AGE 5 MODULES
  const modules5 = [
    "Color Quiz",
    "Odd Quiz",
    "Scramble Quiz",
    "Pattern Quiz",
    "Pick things Quiz",
    "Word Quiz"
  ];

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const res = await findAllByEmail(userEmail);
      const kidIds = res?.map(child => child.id) || [];

      const allProgress = [];

      for (const kidId of kidIds) {
        const user = await findById(kidId);
        const kidQuizesDone = await findAllByKidId(kidId);

        const quizMap = {};
        kidQuizesDone.forEach(q => {
          quizMap[q.quiz_name] = q;
        });


        const kidAge = user.age;
        const modules =
          kidAge == 5
            ? modules5
            : kidAge == 4
              ? modules4
              : modules3;

        const moduleStatuses = modules.map(module => {
          const quiz = quizMap[module];

          if (!quiz) {
            return { module, status: 'Not Started', right: 0, wrong: 0 };
          }

          const total = quiz.right_answers + quiz.wrong_answers;

          let status = 'In Progress';

          if (total >= 26) {
            status = 'Done';
          }

          return {
            module,
            status,
            right: quiz.right_answers,
            wrong: quiz.wrong_answers,
          };
        });

        allProgress.push({ childName: user.name, modules: moduleStatuses });
      }

      setProgressData(allProgress);

    } catch (err) {
      console.error('Failed to load progress', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.childHeader}>{item.childName}</Text>

      {item.modules.map((mod, index) => {
        let message = '';

        if (mod.wrong === 0 && mod.right == 0) {
          message = 'Pending... ';
        }
        else if (mod.wrong === 0 && mod.right > 0) {
          message = 'Excellent Job';
        } else if (mod.wrong < 5 && mod.right > 0) {
          message = 'Good Job';
        } else if (mod.wrong > 5 && mod.right > 0) {
          message = 'Keep Practicing';
        }

        return (
          <View key={index} style={styles.moduleRow}>
            <Text style={styles.text}>• {mod.module}</Text>

            <Text style={{ marginLeft: 10, color: "#555" }}>
              ({mod.right} ✔ / {mod.wrong} ❌)
            </Text>

            <Text style={{ marginLeft: 10, color: "#6C5CE7" }}>
              {message}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons name="arrow-back" size={24} color="#6C5CE7" />
        </TouchableOpacity>

        <Text style={styles.header}>Children Progress</Text>

        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={progressData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default ProgressList;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6FF',
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7675',
    textAlign: 'center',
    flex: 1,
    textDecorationLine: 'underline',
  },

  list: {
    paddingBottom: 30,
  },

  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  childHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 10,
    textAlign: 'center',
  },

  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },

  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});