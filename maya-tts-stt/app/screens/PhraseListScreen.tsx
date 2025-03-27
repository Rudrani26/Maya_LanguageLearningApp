import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Phrase, phrases } from '../constants/phrases';
import { Ionicons } from '@expo/vector-icons';

const PhraseListScreen = () => {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module: string }>();

  // Retrieve the list of phrases for the selected module
  const modulePhrases = phrases[module] || [];

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
              router.push({
                pathname: "/screens/PhraseLearnScreen",
                params: { phrase: JSON.stringify(item), module },
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
    padding: 20,
    backgroundColor: '#e9f3fb',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phrase: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
});

export default PhraseListScreen;
