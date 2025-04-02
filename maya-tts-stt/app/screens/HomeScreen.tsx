import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

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
  ]
};

type CulturalTip = {
  name: string;
  image: any;
  page: string;
  content: string;
};

const HomeScreen = () => {
  const router = useRouter();
  const [selectedTip, setSelectedTip] = useState<CulturalTip | null>(null);
  const [activeTab, setActiveTab] = useState('Home');

  const modules = [
    { name: 'Basic Essentials', icon: require('../assets/icons/essentials.png'), page: 'Greetings' },
    { name: 'Transportation', icon: require('../assets/icons/transport.png'), page: 'Travel' },
    { name: 'Housing', icon: require('../assets/icons/accomodation.png'), page: 'Hotel' },
    { name: 'Food & Dining', icon: require('../assets/icons/food.png'), page: 'Restaurant' },
    { name: 'Shopping', icon: require('../assets/icons/shopping.png'), page: 'Shopping' },
    { name: 'Sightseeing', icon: require('../assets/icons/sightseeing.png'), page: 'Sightseeing' },
    { name: 'Health & Emergencies', icon: require('../assets/icons/health.png'), page: 'Health' },
    { name: 'Socializing & Networking', icon: require('../assets/icons/socializing.png'), page: 'Socializing' },
    { name: 'Work-Related Travel', icon: require('../assets/icons/work-related.png'), page: 'Work-Related' },
    { name: 'Tech Support', icon: require('../assets/icons/technical-support.png'), page: 'Tech' },
  ];

  const culturalTips = [
    {
      name: 'Dress Modestly at Religious Sites',
      image: require('../assets/images/temple.png'),
      page: 'DressModestly',
      content: 'When visiting temples or religious sites in Maharashtra, dress modestly covering shoulders and knees. Remove footwear before entering sacred spaces. Women may consider carrying a scarf to cover their heads in certain places. This shows respect for local customs and traditions.'
    },
    {
      name: 'Respect Historical Monuments',
      image: require('../assets/images/monuments.png'),
      page: 'RespectMonuments',
      content: 'Maharashtra is home to UNESCO World Heritage sites like Ajanta and Ellora Caves. Don\'t touch ancient carvings or paintings as oils from hands can damage them. Follow photography rules and respect designated pathways. Avoid graffiti or scratching your name on any monument - it\'s illegal and disrespectful.'
    },
    {
      name: 'Local Etiquette in Rural Areas',
      image: require('../assets/images/rural.png'),
      page: 'LocalEtiquette',
      content: 'In rural Maharashtra, greet elders with a "Namaste" and wait to be invited before entering homes. Accept refreshments offered as refusal may be considered impolite. Ask permission before photographing locals. Learn a few Marathi phrases - even simple greetings will be greatly appreciated by locals.'
    },
    {
      name: 'Fort Etiquette',
      image: require('../assets/images/fort.png'),
      page: 'FortEtiquette',
      content: 'Maharashtra\'s forts like Raigad and Shivneri hold historical significance. Stay on designated paths, avoid climbing fragile structures, and don\'t litter. Some forts have small temples where respectful behavior is expected. Wear comfortable footwear as most forts require considerable walking on uneven terrain.'
    },
    {
      name: 'Street Food Safety',
      image: require('../assets/images/street.png'),
      page: 'StreetFood',
      content: 'Try Maharashtra\'s famous street foods like vada pav and misal pav, but choose vendors with high turnover and clean preparation areas. Ensure food is served hot and freshly prepared. Avoid raw garnishes if you have a sensitive stomach. Carry bottled water and hand sanitizer for food adventures.'
    },
    {
      name: 'Festival Crowd Awareness',
      image: require('../assets/images/festival.png'),
      page: 'Festivals',
      content: 'Festivals like Ganesh Chaturthi in Mumbai attract massive crowds. Keep valuables secure, stay hydrated, and be aware of your surroundings. During Dahi Handi celebrations, maintain safe distance from human pyramids. Follow security instructions at festival sites and consider visiting with a local guide.'
    },
    {
      name: 'Footwear Rules',
      image: require('../assets/images/footwear.png'),
      page: 'Footwear',
      content: 'Always remove footwear before entering temples, homes, and some small local shops. Look for shoe racks or areas where others have left their shoes. Consider wearing slip-on footwear for convenience. Some sacred sites may request you to remove leather items before entering.'
    },
    {
      name: 'Weather Preparedness',
      image: require('../assets/images/weather.png'),
      page: 'Weather',
      content: 'Maharashtra\'s coastal regions are humid while interior areas can be hot and dry. Monsoon season (June-September) brings heavy rainfall, especially in Mumbai and the Western Ghats. Pack lightweight, breathable clothing, sun protection, and during monsoon, quick-dry clothes and waterproof bags are essential.'
    },
    {
      name: 'Respect Nature',
      image: require('../assets/images/wildlife.png'),
      page: 'Nature',
      content: 'When visiting wildlife sanctuaries like Tadoba or the Western Ghats, follow guide instructions and don\'t feed animals. Stay on designated trails while trekking. In beach areas like Konkan, respect marine life and avoid disturbing coral reefs. Don\'t litter and consider participating in local conservation efforts.'
    },
    {
      name: 'Cultural Sensitivity',
      image: require('../assets/images/culture.png'),
      page: 'Sensitivity',
      content: 'Maharashtra has a rich cultural heritage spanning various communities. Avoid stereotyping locals or making comparisons to Bollywood. Learn about local art forms like Warli painting and Lavani dance with genuine interest. Respect religious diversity and local customs during ceremonies or festivals you might encounter.'
    },
  ];

  const handleTipPress = (tip: CulturalTip) => {
    setSelectedTip(tip);
  };

  const navbarItems = [
    {
      iconName: 'home-outline',
      activeIconName: 'home',
      label: 'Home',
      onPress: () => {
        setActiveTab('Home');
        // Stay on current screen - Home
      }
    },
    {
      iconName: 'people-outline',
      activeIconName: 'people',
      label: 'Community',
      onPress: () => {
        setActiveTab('Community');
        router.push("/screens/Chat");
      }
    },
    {
      iconName: 'chatbubble-outline',
      activeIconName: 'chatbubble',
      label: 'Chatbot',
      onPress: () => {
        setActiveTab('Chatbot');
        router.push("/screens/ChatBot");
      }
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Modules Grid */}
        <View style={styles.modulesContainer}>
          {modules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moduleButton,
                { backgroundColor: APP_COLORS.moduleColors[index % APP_COLORS.moduleColors.length] }
              ]}
              onPress={() => router.push({
                pathname: "/screens/PhraseListScreen",
                params: { module: module.page }
              })}
            >
              <Image source={module.icon} style={styles.moduleIcon} />
              <Text style={styles.moduleText}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cultural Tips Section */}
        <Text style={styles.sectionTitle}>Cultural Guidance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {culturalTips.map((tip, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tipCard}
              onPress={() => handleTipPress(tip)}
            >
              <Image source={tip.image} style={styles.tipImage} />
              <Text style={styles.tipText}>{tip.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tip Modal */}
        <Modal
          visible={!!selectedTip}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedTip(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.modalContent}>
                  {selectedTip && (
                    <>
                      <Text style={styles.modalTitle}>{selectedTip.name}</Text>
                      <Text style={styles.modalContentText}>{selectedTip.content}</Text>
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedTip(null)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView >

      {/* Bottom Navbar */}
      < View style={styles.navbar} >
        {navbarItems.map((item, index) => {
          const isActive = activeTab === item.label;

          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={item.onPress}
            >
              <Ionicons
                name={isActive ? item.activeIconName : item.iconName}
                size={24}
                color={APP_COLORS.navbarIcon}
              />
              <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  scrollContainer: {
    paddingTop: 25,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moduleButton: {
    width: '48%',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
  moduleIcon: {
    width: 55,
    height: 55,
    marginBottom: 12,
  },
  moduleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.text,
    marginVertical: 18,
    marginLeft: 5,
  },
  tipCard: {
    width: 240,
    marginRight: 15,
    backgroundColor: APP_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tipImage: {
    width: '100%',
    height: 150,
  },
  tipText: {
    fontSize: 15,
    padding: 14,
    color: APP_COLORS.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 25,
    backgroundColor: APP_COLORS.background,
    borderRadius: 20,
    padding: 0,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  modalScrollView: {
    maxHeight: '100%',
  },
  modalContent: {
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: APP_COLORS.text,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: APP_COLORS.navbarIcon,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: APP_COLORS.navbar,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  navText: {
    fontSize: 12,
    color: APP_COLORS.navbarIcon,
    marginTop: 3,
  },
  activeNavText: {
    fontWeight: '700',
  },
});

export default HomeScreen;