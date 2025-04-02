import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import LottieView from 'lottie-react-native';

// Define message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const APP_COLORS = {
  primary: '#B8E0D4',
  secondary: '#FFD6E5',
  accent: '#C3B1E1',
  background: '#FFFFFF',
  text: '#4A4A4A',
  border: '#E0E0E0',
  navbar: '#F8F9FA',
  navbarIcon: '#3884fd',
  avatarBackground: '#D6EFFF', 
  moduleColors: [
    '#FF6B8A',  // Pink
    '#71CDDC',  // Light Blue
    '#9370DB',  // Medium Purple
    '#A0D568',  // Light Green
    '#6C9AFF',  // Blue
  ]
};

const { width, height } = Dimensions.get('window');

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingAnimation, setTypingAnimation] = useState(false);
  
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const animationRef = useRef<LottieView>(null);
  
  // Add initial message when component mounts
  useEffect(() => {
    setMessages([
      { 
        id: '1', 
        text: 'Hello! I am your Marathi AI Assistant. How can I assist you today?', 
        sender: 'bot' 
      },
    ]);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    // Add user's message
    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Show typing animation
    setTypingAnimation(true);

    try {
      setLoading(true);
      console.log('[ChatBot] Sending message to backend:', input);

      // Make API request
      const response = await axios.post('http://192.168.1.13:8000/chat/', {
        question: input,
      });

      console.log('[ChatBot] Received response from backend:', response.data);

      // Add a small delay to show typing animation
      setTimeout(() => {
        setTypingAnimation(false);
        
        // Add bot's response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.response || 'Sorry, I didn\'t get that.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('[ChatBot] Error sending message to backend:', error);
      
      setTimeout(() => {
        setTypingAnimation(false);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Something went wrong. Please try again later.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <LottieView
                ref={animationRef}
                source={require('../assets/animations/robot-wave.json')}
                autoPlay
                loop
                style={styles.avatarAnimation}
              />
            </View>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>
        </View>
        {isUser && <View style={styles.spacer} />}
      </View>
    );
  };
  
  const renderTypingIndicator = () => {
    if (!typingAnimation) return null;
    
    return (
      <View style={[styles.messageContainer, styles.botMessage]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <LottieView
              source={require('../assets/animations/robot-wave.json')}
              autoPlay
              loop
              style={styles.avatarAnimation}
            />
          </View>
        </View>
        <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color={APP_COLORS.text} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Marathi AI Assistant</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="settings-outline" size={24} color={APP_COLORS.navbarIcon} />
          </View>
        </View>
        
        {/* Message List */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            ListFooterComponent={renderTypingIndicator}
          />
          
          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle-outline" size={24} color={APP_COLORS.navbarIcon} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#A0A0A0"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={[
                styles.sendButton,
                { backgroundColor: input.trim().length > 0 ? APP_COLORS.navbarIcon : '#E0E0E0' }
              ]} 
              disabled={loading || input.trim().length === 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
    backgroundColor: APP_COLORS.background,
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_COLORS.text,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.avatarBackground, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarAnimation: {
    width: 40,
    height: 40,
  },
  spacer: {
    width: 32,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
  },
  userBubble: {
    backgroundColor: APP_COLORS.navbarIcon,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: APP_COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    backgroundColor: APP_COLORS.background,
  },
  attachButton: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: APP_COLORS.text,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: APP_COLORS.navbarIcon,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    minWidth: 70,
    minHeight: 40,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 2,
    opacity: 0.7,
  },
  typingDot1: {
    opacity: 0.7,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 0.7,
  },
});

export default ChatBot;