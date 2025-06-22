import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { kidDoneScreens, findAllByEmail, findById } from './database'; // You must define this DB function
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressList = () => {
  const [progressData, setProgressData] = useState([]);
  const modules = ['Alphabets', 'Counting', 'Shapes', 'Body Parts', 'Solar System'];
  const flashScreen = 'Flashcards';
  const guessAlphabet = 'GuessAlphabet';
  const countingPlay = 'GuessNumber';
  const countingLearn = 'CountingLearn';

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
        const kidScreens = await kidDoneScreens(kidId, 1);
        const screenNames = kidScreens.map(item => item.screen);
        const isAlphabetsDone = screenNames.includes(flashScreen) && screenNames.includes(guessAlphabet);
        const isCountingDone = screenNames.includes(countingPlay) && screenNames.includes(countingLearn);

        const moduleStatuses = modules.map(module => {
          if (module === 'Alphabets') {
            return { module, status: isAlphabetsDone ? 'Done' : 'In Progress' };
          }
          else if (module === 'Counting') {
            return { module, status: isCountingDone ? 'Done' : 'In Progress' };
          }
          else {
            return { module, status: 'In Progress' };
          }
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
      {item.modules.map((mod, index) => (
  <View key={index} style={styles.moduleRow}>
  <Text style={styles.text}>• {mod.module}</Text>
  <Text style={[styles.text, { marginLeft: 10 }]}>
    {mod.status === 'Done' ? '✅' : '⏳'}
  </Text>
</View>
))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>Children Progress</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Consolas',
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
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

