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
import { insertUser, findAllByEmail, update, deleteUser } from './database';
import { Ionicons } from '@expo/vector-icons';

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

    if (editingIndex === null && children.length >= 5) {
      showToast('You can only add up to 5 children.');
      return;
    }

    if (!name.trim()) {
      showToast('Name is required.');
      return;
    }
    if (!/^[A-Za-z]+$/.test(name.trim())) {
      showToast('Name must contain alphabets only.');
      return;
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 9) {
      showToast('Age must be between 1 and 9.');
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
      } catch (error) {
        console.error('Error updating child:', error);
      }
      setEditingIndex(null);
    } else {
      try {
        const payload = {
          name,
          age,
          email: userEmail,
          password,
          role: 'kid',
        };
        const res = await insertUser(payload);
        if (res.changes === 1) fetchProfileData();
      } catch (error) {
        console.error('Error adding child:', error);
      }
    }

    clearForm();
    setShowForm(false);
  };

  const handleDelete = async (index) => {
    try {
      const res = await deleteUser(children[index].id);
      if (res.changes === 1) fetchProfileData();
    } catch (error) {
      console.error('Error deleting child:', error);
    }
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
          <View style={styles.container}>
            <Text style={styles.title}>Children List ({children.length}/5)</Text>

            {children.length > 0 ? (
              <FlatList
                data={children}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                style={styles.list}
              />
            ) : (
              <Text style={styles.noChildren}>No children added yet.</Text>
            )}

            {showForm && (
              <View style={styles.card}>
                <Text style={styles.formTitle}>
                  {editingIndex !== null ? 'Edit Child' : 'Add New Child'}
                </Text>

                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#8B0000"
                />

                <TextInput
                  placeholder="Age (1-9)"
                  value={age}
                  onChangeText={(text) => {
                    if (text.length <= 1 && /^[1-9]?$/.test(text)) {
                      setAge(text);
                    }
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={1}
                  placeholderTextColor="#8B0000"
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#8B0000"
                    maxLength={12}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#8B0000"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                <Button mode="contained" onPress={handleAddOrEdit} style={styles.addButton}>
                  {editingIndex !== null ? 'Update Child' : 'Save Child'}
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => {
                    clearForm();
                    setEditingIndex(null);
                    setShowForm(false);
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>

                {editingIndex !== null && (
                  <Button
                    mode="contained"
                    buttonColor="red"
                    onPress={() => handleDelete(editingIndex)}
                    style={styles.deleteButton}
                  >
                    Delete This Child
                  </Button>
                )}
              </View>
            )}

            {!showForm && children.length < 5 && (
              <View style={styles.bottomButton}>
                <Button
                  mode="contained"
                  onPress={() => {
                    clearForm();
                    setEditingIndex(null);
                    setShowForm(true);
                  }}
                  style={styles.addNewButton}
                >
                  ➕ Add New Child
                </Button>
              </View>
            )}

            {children.length >= 5 && (
              <Text style={styles.limitText}>Maximum 5 child profiles allowed.</Text>
            )}
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
    backgroundColor: '#FFD700',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B0000',
  },
  noChildren: {
    textAlign: 'center',
    marginVertical: 10,
    color: 'grey',
  },
  limitText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 5,
  },
  list: {
    marginBottom: 20,
  },
  childItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  childText: {
    fontSize: 14,
    color: '#555',
  },
  bottomButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  addNewButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#8B0000',
  },
  card: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderColor: '#8B0000',
    borderWidth: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#8B0000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8B0000',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#8B0000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#8B0000',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#8B0000',
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#8B0000',
  },
  cancelButton: {
    marginTop: 10,
    borderColor: '#999',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});
