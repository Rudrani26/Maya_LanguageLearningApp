import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Ionicons } from '@expo/vector-icons'; // For TTS and STT icons
import { Phrase } from '../constants/phrases';
import * as FileSystem from 'expo-file-system'; // For file system operations
import { Audio } from 'expo-av'; // For playing audio
import axios from 'axios'; // For API requests
import base64js from 'base64-js'; // For Base64 encoding

const { width } = Dimensions.get('window');

// Axios instance for API requests
const apiClient = axios.create({
  baseURL: "http://192.168.1.2:8000", // Replace with your local IP address
  headers: {
    "Content-Type": "application/json",
  },
});

const PhraseLearnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { phrase } = route.params as { phrase: Phrase };

  const [progress, setProgress] = useState(0.1);
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State to manage sound
  const [buttonPressed, setButtonPressed] = useState(false); // Track button press state

  const handleNext = () => {
    setProgress((prev) => Math.min(1, prev + 0.1));
    navigation.goBack(); // Placeholder for advancing to the next phrase
  };

  const handlePlayPhrase = async () => {
    const data = { text: phrase.translation }; // Marathi text
  
    try {
      const response = await apiClient.post("/generate-audio/", data, {
        responseType: "arraybuffer", // Receive the audio file as binary data
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to generate audio");
      }
  
      // Convert the ArrayBuffer to Base64 using base64-js
      const base64Audio = base64js.fromByteArray(new Uint8Array(response.data));
  
      // Save the audio file to the device storage
      const fileUri = FileSystem.documentDirectory + 'audiofile.wav';
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64, // Save the audio as a Base64 encoded string
      });
  
      // Load and play the audio using expo-av
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri }, // Use the fileUri directly, pointing to the saved file
        { shouldPlay: true }
      );
  
      setSound(sound); // Save the sound object to state
      console.log("Playing phrase:", phrase.translation);
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  };

  const handleStartSpeechRecognition = () => {
    // Placeholder for STT logic (Speech-to-Text)
    console.log("Start speech recognition");
  };

  const progressPercentage = progress * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Learn This Phrase</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${progressPercentage}%` }]}
        />
      </View>

      {/* Phrase Card */}
      <View style={styles.card}>
        <Text style={styles.label}>English Phrase:</Text>
        <Text style={styles.value}>{phrase.phrase}</Text>

        <Text style={styles.label}>Translation:</Text>
        <Text style={styles.value}>{phrase.translation}</Text>

        <Text style={styles.label}>Pronunciation:</Text>
        <Text style={styles.value}>{phrase.transliteration}</Text>
      </View>

      {/* Interaction Buttons */}
      <View style={styles.buttonContainer}>
        {/* Listen to Phrase Button */}
        <TouchableOpacity
          onPressIn={() => setButtonPressed(true)} // Momentarily set pressed state
          onPressOut={() => setButtonPressed(false)} // Revert pressed state
          onPress={handlePlayPhrase}
          style={[styles.button, buttonPressed && styles.buttonPressed]} // Apply pressed state styling
        >
          <Ionicons name="volume-high" size={24} color="#fff" />
          <Text style={styles.buttonText}>Listen to Phrase</Text>
        </TouchableOpacity>

        {/* Speak the Phrase Button */}
        <TouchableOpacity
          onPressIn={() => setButtonPressed(true)} // Momentarily set pressed state
          onPressOut={() => setButtonPressed(false)} // Revert pressed state
          onPress={handleStartSpeechRecognition}
          style={[styles.button, buttonPressed && styles.buttonPressed]} // Apply pressed state styling
        >
          <Ionicons name="mic" size={24} color="#fff" />
          <Text style={styles.buttonText}>Speak the Phrase</Text>
        </TouchableOpacity>
      </View>

      {/* Next Phrase Button with Arrow */}
      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Ionicons name="arrow-forward" size={24} color="#fff" />
        <Text style={styles.nextButtonText}>Next Phrase</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3a3a3a',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  progressContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3884fd',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    color: '#3a3a3a',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    maxWidth: 350,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3884fd',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  buttonPressed: {
    backgroundColor: '#F2D16A', // Yellow on press
    transform: [{ scale: 0.98 }], // Slight shrink effect on press
  },
  nextButton: {
    backgroundColor: '#3a3a3a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: '100%',
    maxWidth: 350,
    elevation: 5,
    flexDirection: 'row',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
});

export default PhraseLearnScreen;
