import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { firestoreDB } from "@/config/firebase.config";

const APP_COLORS = {
  primary: '#B8E0D4',
  secondary: '#FFD6E5',
  accent: '#C3B1E1',
  background: '#FFFFFF',
  text: '#4A4A4A',
  border: '#E0E0E0',
  navbar: '#F8F9FA',
  navbarIcon: '#3884fd',
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
    '#5DADE2',  // Bright Blue
    '#48C9B0',  // Turquoise
    '#AF7AC5',  // Purple
    '#EC7063',  // Coral
    '#F4D03F',  // Yellow
    '#52BE80',  // Green
    '#E74C3C',  // Red
    '#3498DB',  // Blue
    '#1ABC9C',  // Emerald
    '#F39C12',  // Orange
  ]
};

interface ChatRoom {
  _id: string;
  chatName: string;
}

const Chat = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  
  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    // this is what makes things reload automatically when new thing is added
    const unsubscribe = onSnapshot(
      chatQuery,
      (querySnapshot: QuerySnapshot) => {
        const chatRooms: ChatRoom[] = querySnapshot.docs.map(
          (doc) => doc.data() as ChatRoom
        );
        console.log("Fetched chat rooms:", chatRooms);
        setChats(chatRooms);
        setIsLoading(false);
      }
    );
    // returning unsubscribe function to stop listening to updates
    return unsubscribe;
  }, []);

  console.log("Logged User", user);

  const handleAddChat = () => {
    router.push("/screens/AddChat");
  };
  
  // Updated navbar items with navigation functionality - all in one line
  const navbarItems = [
    { 
      iconName: 'home-outline', 
      activeIconName: 'home',
      label: 'Home',
      onPress: () => {
        router.push("/screens/HomeScreen"); // Changed to HomeScreen.tsx as requested
      }
    },
    { 
      iconName: 'people-outline', 
      activeIconName: 'people',
      label: 'Community', 
      onPress: () => {
        // Already on Chat/Community screen
      }
    },
    { 
      iconName: 'chatbubble-outline', 
      activeIconName: 'chatbubble',
      label: 'Chatbot',
      onPress: () => {
        router.push("/screens/ChatBot");
      }
    },
    { 
      iconName: 'person-outline', 
      activeIconName: 'person',
      label: 'Profile',
      onPress: () => {
        router.push("/screens/HomeScreen");
      }
    },
  ];

  const chatColorMap = useMemo(() => {
    const colorMap = new Map<string, string>();
    
    chats.forEach((room, index) => {
      const colorIndex = index % APP_COLORS.moduleColors.length;
      colorMap.set(room._id, APP_COLORS.moduleColors[colorIndex]);
    });
    
    return colorMap;
  }, [chats]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search chats"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <ScrollView style={styles.scroll}>
          <View style={styles.mainChat}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={APP_COLORS.navbarIcon} />
              </View>
            ) : (
              <>
                {chats && chats.length > 0 ? (
                  chats.map((room, index) => (
                    <MessageCard 
                      key={room._id} 
                      room={room} 
                      avatarColor={chatColorMap.get(room._id) || APP_COLORS.moduleColors[index % APP_COLORS.moduleColors.length]}
                    />
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="chatbubble-ellipses-outline" size={60} color="#CCCCCC" />
                    <Text style={styles.emptyStateText}>No chats available</Text>
                    <Text style={styles.emptyStateSubText}>Start a new conversation!</Text>
                    <TouchableOpacity 
                      style={styles.emptyStateButton}
                      onPress={handleAddChat}
                    >
                      <Text style={styles.emptyStateButtonText}>Create Chat</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.fab} onPress={handleAddChat}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.navbar}>
          {navbarItems.map((item, index) => {
            const isActive = index === 1; 
            
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
        </View>
      </SafeAreaView>
    </View>
  );
};

interface MessageCardProps {
  room: ChatRoom;
  avatarColor: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ room, avatarColor }) => {
  // Get first letter of chat name for avatar
  const firstLetter = room.chatName.charAt(0).toUpperCase();
  
  // Generate random time for demo purposes
  const getRandomTime = () => {
    const times = ["4:28 PM", "1:46 PM", "1d", "1w"];
    return times[Math.floor(Math.random() * times.length)];
  };
  
  const time = getRandomTime();

  // Track if the chat has been read
  const [isRead, setIsRead] = useState(false);
  
  // For demo purposes, randomly determine if a chat has unread messages (can be replaced with actual logic later)
  const [hasUnread] = useState(Math.random() > 0.5);

  
  const getLighterColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const lighterR = Math.floor(r * 0.8 + 255 * 0.2);
    const lighterG = Math.floor(g * 0.8 + 255 * 0.2);
    const lighterB = Math.floor(b * 0.8 + 255 * 0.2);
    
    return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
  };

  const handleChatPress = () => {
    setIsRead(true); 
    router.push({
      pathname: "/screens/ChatScreen",
      params: { 
        room: JSON.stringify(room),
        avatarColor: avatarColor 
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleChatPress}
      style={styles.chatItem}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{firstLetter}</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{room.chatName}</Text>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            Click to join this conversation
          </Text>
          {!isRead && hasUnread && (
            <View 
              style={[
                styles.unreadIndicator, 
                { backgroundColor: getLighterColor(avatarColor) }
              ]}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Chat;

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    paddingBottom: 15,
    backgroundColor: APP_COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: APP_COLORS.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: APP_COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  mainChat: {
    width: width,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: APP_COLORS.text,
    textTransform: "capitalize",
  },
  timestamp: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  chatFooter:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#767676",
    flex: 1,
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 120, 
    backgroundColor: APP_COLORS.navbarIcon,
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: APP_COLORS.navbar,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
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
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: APP_COLORS.text,
    marginTop: 20,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#A0A0A0",
    marginTop: 5,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: APP_COLORS.navbarIcon,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});