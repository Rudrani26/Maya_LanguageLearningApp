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

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const textInputRef = useRef(null);
  // const { room, image } = route.params;

  const storage = getStorage();
  const params = useLocalSearchParams();
  console.log("Params:", params);
  // const { room } = useLocalSearchParams();
  const room = params.room ? JSON.parse(params.room as string) : null;
  const image = params.image ? JSON.parse(params.image as string) : null;


  console.log("Room Data:", room);


  console.log("Room Data:", room);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#fff"} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{room.chatName}</Text>
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
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              ) : (
                messages?.map((msg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.message,
                      {
                        alignSelf:
                          msg.user?.providerData?.email ===
                            user?.providerData?.email
                            ? "flex-end"
                            : "flex-start",
                        flexDirection:
                          msg.user?.providerData?.email ===
                            user?.providerData?.email
                            ? "row-reverse"
                            : "row",
                      },
                    ]}
                  >
                    {msg.user?.providerData?.email !==
                      user?.providerData?.email && (
                        <Image
                          source={{ uri: "path_to_default_profile_image" }} // Update to the correct path or a default image
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
                          {
                            backgroundColor:
                              msg.user?.providerData?.email ===
                                user?.providerData?.email
                                ? "#43C651" // Replace with your secondary color
                                : "#E0E0E0", // Replace with your gray color
                          },
                        ]}
                      >
                        <Text style={styles.messageText}>{msg.message}</Text>
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
                ))
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
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
                  <Entypo name="mic" size={24} color="#43C651" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendImage}
              >
                <FontAwesome name="send" size={24} color="#555" />
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
    height: "20%",
    backgroundColor: "#3884fd",
    paddingHorizontal: 16,
    paddingVertical: 50,
    flexDirection: "row",
  },
  headerTextContainer: {
    paddingLeft: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  messageContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    marginVertical: 4,
    flexDirection: "row",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
  userName: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    width: "auto",
    position: "relative",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },
  timeContainer: {
    alignSelf: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    paddingLeft: 16,
  },
});
