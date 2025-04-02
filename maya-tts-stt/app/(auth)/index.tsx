import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();
  const robotBounce = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotBounce, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(robotBounce, {
          toValue: 0,
          duration: 1500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, []);

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (showButtons) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [showButtons]);

  const navigateToSignup = () => {
    router.replace('/Signup');
  };

  const navigateToLogin = () => {
    router.replace('/Login');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Animated.View
        style={[
          styles.robotContainer,
          {
            transform: [
              {
                translateY: robotBounce.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      >
        <LottieView
          ref={lottieRef}
          source={require('../assets/animations/robot-wave.json')}
          style={styles.robotAnimation}
          autoPlay
          loop
        />
      </Animated.View>
      
      <View style={styles.textContainer}>
        <Text style={styles.welcomeTitle}>Hello, I'm Maya!</Text>
        <Text style={styles.welcomeSubtitle}>Your Marathi Learning Assistant</Text>
        <Text style={styles.welcomeMessage}>
          Let's embark on a wonderful journey to learn Marathi together!
        </Text>
      </View>
      
      {showButtons && (
        <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={navigateToSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonAlt} 
            onPress={navigateToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextAlt}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c8ffd', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  robotContainer: {
    width: 220,
    height: 220,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotAnimation: {
    width: 220,
    height: 220,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    fontSize: 22,
    color: '#F0F0F0',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    gap: 15,
  },
  button: {
    width: width - 60,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#4c8ffd',
  },
  buttonAlt: {
    width: width - 60,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonTextAlt: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
});

export default WelcomeScreen;