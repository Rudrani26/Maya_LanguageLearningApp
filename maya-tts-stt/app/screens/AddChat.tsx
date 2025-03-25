import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "@/config/firebase.config";

const AddChat = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");

  const createNewChat = async () =>{
    let id = `${Date.now()}`;
    const _doc = {
      _id:id,
      user: user,
      chatName : addChat
    }
    if(addChat !==""){
      setDoc(doc(firestoreDB, "chats",id), _doc).then(()=> {

        setAddChat("");
        navigation.replace("Chat");
      }).catch((err)=> {
        alert("error: ", err);
      })
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.inside}>
        <View style={styles.bar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#ffffff"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profile}>
            <FontAwesome5 name="user-alt" size={25} color={"#ffffff"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionInside}>
          <View style={styles.type}>
            {/* icons */}

            <Ionicons name="chatbubbles" size={24} color="#777" />
            {/* Text input */}

            <TextInput
              style={styles.textInput}
              placeholder="create a chat"
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
            />



            <TouchableOpacity className="flex-1 justify-center bg" onPress={createNewChat}>
              <FontAwesome name="send" size={24} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddChat;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inside: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    backgroundColor: "#3884fd",
    justifyContent: "center",
    flex: 0.1,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ffffff",
  },
  section: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 40,
    flex: 1,
    borderRadius: 30,
    marginTop: -10,
  },
  sectionInside: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 50,
    marginLeft: 4,
    paddingVertical: 20,
  },
  type: {
    width: "150%",
    paddingHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
});
