import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "@/config/firebase.config";
import { router } from "expo-router";

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

const AddChat = () => {
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = async () => {
    if (addChat.trim() === "") {
      return;
    }

    setIsLoading(true);
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatName: addChat.trim()
    };

    try {
      await setDoc(doc(firestoreDB, "chats", id), _doc);
      setAddChat("");
      // Navigate to Chat screen after creating chat
      router.push("/screens/Chat");
    } catch (err) {
      alert("Error creating chat: " + (err?.message || String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    // Navigate back to Chat screen
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
     
        <View style={styles.gradientHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Chat</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.formCard}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="chatbubbles"
                size={40}
                color="#FFFFFF"
              />
            </View>
            
            <Text style={styles.label}>Chat Name</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#A0A0A0"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter chat name"
                placeholderTextColor="#A0A0A0"
                value={addChat}
                onChangeText={(text) => setAddChat(text)}
                autoFocus
              />
              {addChat.length > 0 && (
                <TouchableOpacity onPress={() => setAddChat("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.createButton,
                { opacity: addChat.trim() === "" || isLoading ? 0.7 : 1 }
              ]}
              onPress={createNewChat}
              disabled={addChat.trim() === "" || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.createButtonText}>Create Chat</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Tips for a great chat:</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color={APP_COLORS.moduleColors[0]} />
              <Text style={styles.tipText}>Use descriptive names like "Maharashtra Tour Group"</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color={APP_COLORS.moduleColors[1]} />
              <Text style={styles.tipText}>Keep names short and specific</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color={APP_COLORS.moduleColors[2]} />
              <Text style={styles.tipText}>Avoid special characters</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AddChat;

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  gradientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 30,
    paddingBottom: 20,
    backgroundColor: APP_COLORS.navbarIcon,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40, 
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    backgroundColor: APP_COLORS.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: APP_COLORS.moduleColors[3], 
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: APP_COLORS.text,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F9F9F9",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: APP_COLORS.text,
  },
  createButton: {
    backgroundColor: APP_COLORS.moduleColors[4], 
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },
  tipsCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: APP_COLORS.text,
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#767676",
    marginLeft: 10,
  },
});