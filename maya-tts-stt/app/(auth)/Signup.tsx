import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
// import useFonts from "../hooks/useFonts";
import UserTextInput from "../components/UserTextInput";
import { router } from "expo-router";
import { firebaseAuth, firestoreDB } from "../../config/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  // const fontsLoaded = useFonts();
  const [email, setEmail] = useState("");
  const [getEmailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // if (!fontsLoaded) {
  //   return null;
  // }

  const handleSignUpButton = async () => {
    if (getEmailValid && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            providerData: userCred.user.providerData[0],
          };
          console.log(userCred.user);

          // defining a doc for the collection, and passing data to it
          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => router.push("/Login")
          );
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Inside}>
        <View style={styles.form}>
          <Text style={styles.Text}>Welcome!</Text>
          {/* FullName */}
          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStateValue={setName}
          />
          {/* Email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStateValue={setEmail}
            setEmailValid={setEmailValid}
          />
          {/* Pass */}
          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStateValue={setPassword}
          />
          {/* Login */}
          <TouchableOpacity style={styles.button} onPress={handleSignUpButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.create}>
            <Text style={{ fontFamily: "NunitoReg" }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                // console.log("Navigating to home");
                router.push("/Login");
              }}
            >
              <Text style={styles.createText}> Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Signup;

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3884fd",
  },
  Inside: {
    backgroundColor: "#ffffff",
    width: width - 40,
    marginTop: 50,
    padding: 20,
    height: height - 150,
    elevation: 10,
    borderRadius: 10,
  },
  Text: {
    fontFamily: "NunitoBold",
    fontSize: 30,
    textAlign: "center",
    color: "#050a30",
    // marginTop: 120,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: width - 60,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f2d16a",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "NunitoBold",
    fontSize: 14,
    color: "#050a30",
  },
  create: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createText: {
    color: "#3884fd",
    fontFamily: "NunitoReg"
  },
});
