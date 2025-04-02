import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import UserTextInput from "../components/UserTextInput";
import { useRouter } from "expo-router";
import { firebaseAuth, firestoreDB } from "../../config/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [getEmailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const robotWiggle = useRef(new Animated.Value(0)).current;
  const formSlideUp = useRef(new Animated.Value(50)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotWiggle, {
          toValue: -5,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(robotWiggle, {
          toValue: 5,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        })
      ])
    ).start();
    
    Animated.parallel([
      Animated.timing(formSlideUp, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUpButton = async () => {
    if (name.trim() === "") {
      setAlert(true);
      setAlertMessage("Please enter your name");
      setTimeout(() => setAlert(false), 2000);
      return;
    }
    
    if (!getEmailValid || email === "") {
      setAlert(true);
      setAlertMessage("Please enter a valid email");
      setTimeout(() => setAlert(false), 2000);
      return;
    }
    
    if (password.length < 6) {
      setAlert(true);
      setAlertMessage("Password must be at least 6 characters");
      setTimeout(() => setAlert(false), 2000);
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            providerData: userCred.user.providerData[0],
          };

          // Define a doc for the collection, and passing data to it
          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => router.replace("/Login")
          );
        }
      );
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.message.includes("email-already-in-use") 
        ? "Email already in use" 
        : "Registration failed");
      setTimeout(() => setAlert(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Header with robot animation */}
            <View style={styles.headerContainer}>
              <Animated.View 
                style={{
                  transform: [{ translateX: robotWiggle }]
                }}
              >
                <LottieView
                  ref={lottieRef}
                  source={require('../assets/animations/robot-wave.json')}
                  style={styles.robotAnimation}
                  loop
                />
              </Animated.View>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeTitle}>Join Maya!</Text>
                <Text style={styles.welcomeSubtitle}>Create an account to start your Marathi learning journey</Text>
              </View>
            </View>

            {/* Form Section */}
            <Animated.View 
              style={[
                styles.formContainer, 
                { 
                  opacity: formOpacity,
                  transform: [{ translateY: formSlideUp }] 
                }
              ]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Create Account</Text>
                {alert && <Text style={styles.alert}>{alertMessage}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <UserTextInput
                  placeholder="Full Name"
                  isPass={false}
                  setStateValue={setName}
                />

                <UserTextInput
                  placeholder="Email"
                  isPass={false}
                  setStateValue={setEmail}
                  setEmailValid={setEmailValid}
                />

                <UserTextInput
                  placeholder="Password"
                  isPass={true}
                  setStateValue={setPassword}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.button, 
                  isLoading && styles.buttonDisabled
                ]} 
                onPress={handleSignUpButton}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View style={styles.accountLinkContainer}>
                <Text style={styles.accountLinkText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.replace("/Login")}>
                  <Text style={styles.accountLinkButton}>Login here</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4c8ffd",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  robotAnimation: {
    width: 120,
    height: 120,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#f0f0f0",
    textAlign: "center",
    maxWidth: width - 80,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    width: width - 40,
    marginTop: 10,
    marginBottom: 20,
    padding: 25,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.23,
    shadowRadius: 6,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4c8ffd",
    marginBottom: 10,
  },
  alert: {
    color: "#ff3b30",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "500",
  },
  inputGroup: {
    width: "100%",
    gap: 15,
    marginBottom: 25,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#4c8ffd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: "#a5c3fd",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#ffffff",
  },
  accountLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  accountLinkText: {
    fontSize: 14,
    color: "#666",
  },
  accountLinkButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4c8ffd",
    marginLeft: 5,
  },
});

export default Signup;