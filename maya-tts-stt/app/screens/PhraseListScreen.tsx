<<<<<<< Updated upstream
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
=======
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module: string }>();
  const [moduleColorIndex, setModuleColorIndex] = useState(0);
  const [moduleName, setModuleName] = useState("");
  const [phrasesData, setPhrasesData] = useState<Phrase[]>([]);

  useEffect(() => {
    const index = APP_COLORS.moduleNames.findIndex(name => name === module);
    setModuleColorIndex(index !== -1 ? index : 0);
    
    const moduleMapping = {
      'Greetings': 'Basic Essentials',
      'Travel': 'Transportation',
      'Hotel': 'Housing',
      'Restaurant': 'Food & Dining',
      'Shopping': 'Shopping',
      'Sightseeing': 'Sightseeing',
      'Health': 'Health & Emergencies',
      'SocializingNetworking': 'Socializing & Networking',
      'WorkRelatedTravel': 'Work-Related Travel',
      'TechSupport': 'Tech Support'
    };
    
    setModuleName(moduleMapping[module as keyof typeof moduleMapping] || String(module));
    
    try {
      const moduleKey = String(module);
      const modulePhrases = phrases[moduleKey as keyof typeof phrases];
      
      if (modulePhrases && Array.isArray(modulePhrases)) {
        setPhrasesData(modulePhrases);
      } else {
        console.warn(`No phrases found for module: ${moduleKey}`);
        setPhrasesData([]);
      }
    } catch (error) {
      console.error("Error loading phrases:", error);
      setPhrasesData([]);
    }
  }, [module]);

  const moduleColor = APP_COLORS.moduleColors[moduleColorIndex];
  
  const getLighterShade = (hex: string, percent: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const light = percent / 100;
    const newR = Math.min(255, r + (255 - r) * light);
    const newG = Math.min(255, g + (255 - g) * light);
    const newB = Math.min(255, b + (255 - b) * light);
    
    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };

  const getDarkerShade = (hex: string, percent: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const dark = percent / 100;
    const newR = Math.max(0, r * (1 - dark));
    const newG = Math.max(0, g * (1 - dark));
    const newB = Math.max(0, b * (1 - dark));
    
    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };

  const keyExtractor = (item: Phrase, index: number) => {
    if (item && item.id !== undefined && item.id !== null) {
      return item.id.toString();
    }
    return `phrase-${index}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Header Section */}
      <View style={[styles.headerContainer, { backgroundColor: moduleColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>{moduleName} in Marathi</Text>
      </View>
      
      {phrasesData.length > 0 ? (
        <FlatList
          data={phrasesData}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }: { item: Phrase, index: number }) => {
            if (!item) return null;
            
            return (
              <TouchableOpacity
                style={[styles.card, { 
                  backgroundColor: '#FFFFFF',
                  borderLeftWidth: 5,
                  borderLeftColor: moduleColor,
                  shadowColor: moduleColor
                }]}
                onPress={() => {
                  if (item) {
                    router.push({
                      pathname: "/screens/PhraseLearnScreen",
                      params: { phrase: JSON.stringify(item), module },
                    });
                  }
                }}
              >
                <View style={styles.cardContent}>
                  <Text style={[styles.phrase, { color: '#000000' }]}>
                    {item.phrase || "No phrase available"}
                  </Text>
                  <Ionicons name="chevron-forward" size={24} color={moduleColor} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: '#000000' }]}>No phrases available for this module</Text>
        </View>
      )}
    </SafeAreaView>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 10,
    transform: [{ scale: 1 }],
    // transition: 'all 0.2s ease-in-out',
=======
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
>>>>>>> Stashed changes
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