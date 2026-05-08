import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertUser, findAllByEmail, update, deleteUser, insertKidUsageLimit } from './database';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Notice', message);
  }
};

const ChildrenForm = () => {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const res = await findAllByEmail(userEmail);
      if (res) setChildren(res);
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    }
  };

  const clearForm = () => {
    setName('');
    setAge('');
    setPassword('');
    setId('');
  };

  const handleAddOrEdit = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const parentId = await AsyncStorage.getItem('parentId');

    if (editingIndex === null && children.length >= 30) return;

    if (!name.trim()) {
      showToast('Name is required.');
      return;
    }

    if (!/^[A-Za-z]+$/.test(name.trim())) {
      showToast('Name must contain alphabets only.');
      return;
    }

    if (!age || parseInt(age) < 3 || parseInt(age) > 5) {
      showToast('Age must be between 3 and 5.');
      return;
    }

    if (!password) {
      showToast('Password is required.');
      return;
    }

    if (password.length < 6 || password.length > 12) {
      showToast('Password must be 6 to 12 characters long.');
      return;
    }

    if (editingIndex !== null) {
      const updatedChildren = [...children];
      updatedChildren[editingIndex] = { id, name, age, password, email: userEmail };
      try {
        const res = await update(updatedChildren[editingIndex]);
        if (res.changes === 1) fetchProfileData();
      } catch (error) {}
      setEditingIndex(null);
    } else {
      try {
        const payload = { name, age, email: userEmail, password, role: 'kid' };
        const res = await insertUser(payload);
        if (res.changes === 1) {
          const insertedId = res.lastInsertRowId;
          await insertKidUsageLimit(parentId, insertedId);
          fetchProfileData();
        }
      } catch (error) {}
    }

    clearForm();
    setShowForm(false);
  };

  const handleDelete = async (index) => {
    try {
      const res = await deleteUser(children[index].id);
      if (res.changes === 1) fetchProfileData();
    } catch (error) {}
    setEditingIndex(null);
    clearForm();
    setShowForm(false);
  };

  const handleEdit = (index) => {
    const child = children[index];
    setName(child.name);
    setAge(child.age.toString());
    setPassword(child.password);
    setId(child.id);
    setEditingIndex(index);
    setShowForm(true);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.childItem} onPress={() => handleEdit(index)}>
      <Text style={styles.childText}>Name: {item.name}</Text>
      <Text style={styles.childText}>Age: {item.age}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />

          <View style={styles.container}>

          
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push('/Settings')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Children List ({children.length})</Text>
              <View style={{ width: 24 }} />
            </View>

           
            <View style={styles.card}>

              {children.length > 0 ? (
                <FlatList
                  data={children}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.noChildren}>No children added yet.</Text>
              )}

              {showForm && (
                <View>
                  <Text style={styles.formTitle}>
                    {editingIndex !== null ? 'Edit Child' : 'Add New Child'}
                  </Text>

                  <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    placeholderTextColor="#999"
                  />

                  <TextInput
                    placeholder="Age (3-5)"
                    value={age}
                    onChangeText={setAge}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />

                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.passwordInput}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6C5CE7"
                      />
                    </TouchableOpacity>
                  </View>

                  <Button mode="contained" onPress={handleAddOrEdit} style={styles.signUpButton}>
                    {editingIndex !== null ? 'Update Child' : 'Save Child'}
                  </Button>

                  <Button mode="outlined" onPress={() => setShowForm(false)}>
                    Cancel
                  </Button>

                  {editingIndex !== null && (
                    <Button onPress={() => handleDelete(editingIndex)} buttonColor="red">
                      Delete This Child
                    </Button>
                  )}
                </View>
              )}

              {!showForm && children.length < 30 && (
                <View style={styles.bottomButton}>
                  <Button mode="contained" onPress={() => setShowForm(true)} style={styles.signUpButton}>
                    ➕ Add New Child
                  </Button>
                </View>
              )}

              {children.length >= 30 && (
                <Text style={styles.limitText}>Maximum 30 child profiles allowed.</Text>
              )}

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChildrenForm;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f9ff",
  },

  container: {
    padding: 20,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#6C5CE7",
    top:600,
    left: -5,
    opacity: 0.2,
  },

  circle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF7675",
    top: 400,
    right: -20,
    opacity: 0.2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  backButton: {
    backgroundColor: "#6C5CE7",
    padding: 10,
    borderRadius: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF7675",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    borderWidth: 3,
    borderColor: "#9183fa",
    elevation: 10,
  },

  childItem: {
    backgroundColor: "#f4f6ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    gap:5,
  },

  childText: {
    color: "#555",
  },

  input: {
    backgroundColor: "#f4f6ff",
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d9dcff",
    marginBottom: 12,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6ff",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    padding: 12,
  },

  signUpButton: {
    backgroundColor: "#f97171ff",
    borderRadius: 20,
    marginTop: 10,
    gap:5,
  },

  bottomButton: {
    marginTop: 15,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 10,
    textAlign: "center",
  },

  noChildren: {
    textAlign: "center",
    color: "#999",
    marginVertical: 10,
  },

  limitText: {
    textAlign: "center",
    color: "red",
    marginTop: 10,
  },
});