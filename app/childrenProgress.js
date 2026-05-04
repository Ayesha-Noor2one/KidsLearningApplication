import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { findAllByKidId, findAllByEmail, findById } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProgressList = () => {
  const [progressData, setProgressData] = useState([]);
  const router = useRouter();

  const alphabetsQuiz = "Alphabets Quiz";
  const colorQuiz = 'Colors Quiz';
  const modules = [alphabetsQuiz, colorQuiz];

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const res = await findAllByEmail(userEmail);
      const kidIds = res?.map(child => child.id) || [];
      console.log(kidIds);
      
      const allProgress = [];

      for (const kidId of kidIds) {
        const user = await findById(kidId);
        const kidQuizesDone = await findAllByKidId(kidId);
        const quizMap = {};
        kidQuizesDone.forEach(q => {
          quizMap[q.quiz_name] = q;
        });
        console.log(quizMap);
        
        const moduleStatuses = modules.map(module => {
          const quiz = quizMap[module];

          if (!quiz) {
            return { module, status: 'Not Started', right: 0, wrong: 0 };
          }

          const total = quiz.right_answers + quiz.wrong_answers;

          // Example logic
          let status = 'In Progress';

          if (total >= 26) { // full alphabet
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

      if (mod.wrong === 0 && mod.right==0) {
        message = 'Pending... ';
      }
      else if (mod.wrong === 0 && mod.right>0) {
        message = ' Excellent Job';
      } else if (mod.wrong < 5 && mod.right>0) {
        message = ' Good Job';
      } else if (mod.wrong > 5 && mod.right>0) {
        message = ' Bad Job';
      }

      return (
        <View key={index} style={styles.moduleRow}>
          <Text style={styles.text}>• {mod.module}</Text>

          <Text style={{ marginLeft: 10 }}>
            ({mod.right} ✔ / {mod.wrong} ❌)
          </Text>

          <Text style={{ marginLeft: 10 }}>
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
          <Ionicons name="arrow-back" size={24} color="#8B0000" />
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
    backgroundColor: '#fffefa',
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
    color: '#8B0000',
    textAlign: 'center',
    fontFamily: 'Consolas',
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    flex: 1,
  },
  list: {
    paddingBottom: 30,
  },
  item: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  childHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Consolas',
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    color: '#8B0000',
    fontWeight: 'bold',
    fontFamily: 'Consolas',
  },
});
