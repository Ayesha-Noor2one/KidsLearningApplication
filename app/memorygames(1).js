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
    name: 'Animal Sounds',
    image: require('../assets/images/ans.jpeg'),
    href: '/animal-sound-match',
  },
  {
    id: '3',
    name: 'Shape & Color Match',
    image: require('../assets/images/shcol.jpeg'),
    href: '/shape-color-match',
  },
  {
    id: '4',
    name: 'Sequence Memory',
    image: require('../assets/images/seq.jpeg'),
    href: '/sequence-memory',
  },
  {
    id: '5',
    name: 'Find the Pair',
    image: require('../assets/images/find.jpeg'),
    href: '/find-the-pair',
  },
  {
    id: '6',
    name: 'Spot the Difference',
    image: require('../assets/images/spot.jpeg'),
    href: '/spot',
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
      <Link href="/StartScreen" asChild>
        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home" size={28} color="orange" />
        </TouchableOpacity>
      </Link>

      <Text style={styles.title}>Memory Games</Text>

      <FlatList
        data={memoryGames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
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
  homeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
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
    paddingTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 10,
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
  },
});
