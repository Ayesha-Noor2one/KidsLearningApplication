import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const memoryGames = [
  {
    id: '1',
    name: 'Flip Match',
    image: require('../assets/images/flip.jpeg'),
    href: '/flip-match',
  },
  {
    id: '2',
    name: 'Shape & Color Match',
    image: require('../assets/images/shcol.jpeg'),
    href: '/shape-color-match',
  },
  {
    id: '3',
    name: 'Whack a Mole',
    image: require('../assets/images/DOG (1).png'),
    href: '/whackamole',
  },
];

export default function MemoryGamesMainScreen() {
  const renderItem = ({ item }) => (
    <Link href={item.href} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Back Button to playTime */}
      <Link href="/playTime" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="orange" />
        </TouchableOpacity>
      </Link>

      <Text style={styles.title}>Games</Text>

      <FlatList
        data={memoryGames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E38D',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF6347',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6347',
    textAlign: 'center',
  },
});
