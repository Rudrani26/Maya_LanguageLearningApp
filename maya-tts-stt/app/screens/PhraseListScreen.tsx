import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Phrase, phrases } from '../constants/phrases';
import { Ionicons } from '@expo/vector-icons';

const APP_COLORS = {
  primary: '#B8E0D4',      // Pastel Mint
  secondary: '#FFD6E5',    // Pastel Pink
  accent: '#C3B1E1',       // Pastel Lavender
  background: '#FFFFFF',
  text: '#4A4A4A',
  border: '#E0E0E0',
  navbar: '#F8F9FA',
  navbarIcon: '#3884fd',   // Bright blue for navbar icons  

  moduleColors: [
    '#FF6B8A',  // Pink
    '#FFD166',  // Yellow
    '#71CDDC',  // Light Blue
    '#9370DB',  // Medium Purple
    '#A0D568',  // Light Green
    '#F47ACD',  // Bright Pink
    '#E9C46A',  // Gold
    '#6C9AFF',  // Blue
    '#D9A5F3',  // Lavender
    '#FF9F65',  // Orange
  ],
  moduleNames: [
    'Greetings',
    'Travel',
    'Hotel',
    'Restaurant',
    'Shopping',
    'Sightseeing',
    'Health',
    'SocializingNetworking',
    'WorkRelatedTravel',
    'TechSupport'
  ]
};

const PhraseListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Extract module name from route params
  const { module } = route.params as { module: string };

  // Retrieve the list of phrases for the selected module
  const modulePhrases = phrases[module];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{module} in Marathi</Text>
      <FlatList
        data={modulePhrases}
        keyExtractor={(item) => item.phrase}
        renderItem={({ item }: { item: Phrase }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PhraseLearn', {
                phrase: item,  // Pass the selected phrase
                module,         // Pass the module name
              })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.phrase}>{item.phrase}</Text>
              <Ionicons name="chevron-forward" size={24} color="#007BFF" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 10,
    transform: [{ scale: 1 }],
    // transition: 'all 0.2s ease-in-out',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phrase: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PhraseListScreen;