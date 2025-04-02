import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "@/config/firebase.config";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLocalSearchParams } from "expo-router";
import Color from "color";

const ChatScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const textInputRef = useRef(null);
  const storage = getStorage();
  const params = useLocalSearchParams();
  
  // Parse room data
  const room = params.room ? JSON.parse(params.room as string) : null;
  const image = params.image ? JSON.parse(params.image as string) : null;
  
  const avatarColor = params.avatarColor ? params.avatarColor as string : "#3884fd";
  
  const getColorVariations = (baseColor) => {
    const color = Color(baseColor);
    return {
      header: color.hex(),
      background: color.alpha(0.1).lightness(95).hex(),
      myMessage: color.darken(0.1).hex(),
      otherMessage: color.lighten(0.3).hex(),
      inputBackground: color.lighten(0.4).hex(),
    };
  };
  
  const colors = getColorVariations(avatarColor);

  useLayoutEffect(() => {
    if (!room || !room._id) {
      console.error("No room data found", room);
      return;
    }

    const msgQuery = query(
      collection(firestoreDB, "chats", room._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [room?._id]);

  const uploadImageAndSendMessage = async (image: string | URL | Request) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = ref(storage, `chats/${room._id}/images/${Date.now()}`);

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    // Send message with image URL
    sendMessage(imageUrl);
  };

  const sendMessage = async (imageUrl: string | null = null) => {
    if (!message.trim() && !imageUrl) return;
    
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
      image: imageUrl || null,
    };

    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    ).catch((err) => alert(err));
  };
  
  const handleSendImage = () => {
    if (image) {
      uploadImageAndSendMessage(image);
    } else {
      sendMessage();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#fff"} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{room?.chatName}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size={"large"} color={colors.header} />
                </View>
              ) : (
                <>
                  {messages.length > 0 ? (
                    messages?.map((msg, i) => {
                      const isMyMessage = msg.user?.providerData?.email === user?.providerData?.email;
                      const messageBubbleColor = isMyMessage ? colors.myMessage : colors.otherMessage;
                      
                      return (
                        <View
                          key={i}
                          style={[
                            styles.message,
                            {
                              alignSelf: isMyMessage ? "flex-end" : "flex-start",
                              flexDirection: isMyMessage ? "row-reverse" : "row",
                            },
                          ]}
                        >
                          {!isMyMessage && (
                            <Image
                              source={{ uri: "path_to_default_profile_image" }}
                              style={styles.profileImage}
                            />
                          )}
                          <View>
                            <Text style={styles.userName}>
                              {msg.user?.fullName || "Unknown"}
                            </Text>
                            <View
                              style={[
                                styles.messageBubble,
                                { backgroundColor: messageBubbleColor },
                              ]}
                            >
                              <Text style={[
                                styles.messageText, 
                                { color: isMyMessage ? "#FFFFFF" : "#000000" }
                              ]}>
                                {msg.message}
                              </Text>
                              {msg.image && (
                                <Image
                                  source={{ uri: msg.image }}
                                  style={styles.messageImage}
                                />
                              )}
                            </View>
                            <View style={styles.timeContainer}>
                              {msg?.timeStamp?.seconds && (
                                <Text style={styles.timeText}>
                                  {new Date(
                                    msg?.timeStamp?.seconds * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyMessagesContainer}>
                      <Text style={styles.emptyMessagesText}>No messages yet</Text>
                      <Text style={styles.emptyMessagesSubText}>
                        Be the first to send a message!
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground }]}>
                <TouchableOpacity>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>

                <TextInput
                  ref={textInputRef}
                  style={styles.textInput}
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color={colors.header} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.header }]}
                onPress={handleSendImage}
              >
                <FontAwesome name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: Platform.OS === "ios" ? 120 : 100,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    paddingLeft: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  messageContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  message: {
    marginVertical: 4,
    flexDirection: "row",
    maxWidth: "85%",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  userName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "100%",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 8,
  },
  timeContainer: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginRight: 4,
  },
  timeText: {
    fontSize: 10,
    color: "#777",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
    marginHorizontal: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyMessagesText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  emptyMessagesSubText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },
});