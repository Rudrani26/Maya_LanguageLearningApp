import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
// import useFonts from "../hooks/useFonts";
import UserTextInput from "../components/UserTextInput";
import { useRouter } from "expo-router"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "@/config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../../context/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/HomeScreen";

const Login = () => {
  // const fontsLoaded = useFonts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValid, setEmailValid] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  // if (!fontsLoaded) {
  //   return null;
  // }
  const handleLogin = async () => {
    if (getEmailValid && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then(async (userCred) => {
          if (userCred) {
            console.log("User Id:", userCred?.user.uid);
            const docSnap = await getDoc(
              doc(firestoreDB, "users", userCred?.user.uid)
            );
            if (docSnap.exists()) {
              console.log("User Data: ", docSnap.data());
              dispatch(SET_USER(docSnap.data()));
              await AsyncStorage.setItem("userId", userCred.user.uid);
              console.log("User ID stored in AsyncStorage");
              if (
                docSnap.data().proficiency !== null &&
                docSnap.data().proficiency !== undefined
              ) {
                router.push("/screens/HomeScreen");
              } else {
                router.push("/screens/HomeScreen");
              }
            }
          }
        })
        .catch((err) => {
          console.log("Error: ", err.message);
          if (err.message.includes("invalid-credential")) {
            setAlert(true);
            setAlertMessage("Invalid Credential");
          }
          setTimeout(() => {
            setAlert(false);
          }, 2000);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.Inside}>
        <View style={styles.form}>
          <Text style={styles.Text}>Welcome back!</Text>

          {alert && <Text style={styles.alert}>{alertMessage} </Text>}
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.create}>
            <Text> Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                // console.log("Navigating to home");
                router.push("/Signup");
              }}
            >
              <Text style={styles.createText}> Create Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
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
    // marginTop: 120,
  },
  alert: {
    color: "red",
    fontFamily: "NunitoBold",
    fontSize: 20,
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
  },
  create: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createText: {
    color: "#3884fd",
  },
});
