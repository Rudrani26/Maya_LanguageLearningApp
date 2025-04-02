import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Phrase } from '../constants/phrases';
import useAudioRecording from '../hooks/useAudioRecording';
import api from '../services/axiosConfig';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useOptimizedTTS } from '../hooks/audioPlayer';
import { useLocalSearchParams } from 'expo-router';

const APP_COLORS = {
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
  ],
  moduleNames: [
    'Greetings',
    'Travel',
    'Hotel',
    'Restaurant',
    'Shopping',
    'Sightseeing',
    'Health',
    'Socializing',
    'Work-Related',
    'Tech'
  ]
};

const PhraseLearnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { phrase: phraseString, module } = useLocalSearchParams<{ phrase: string, module: string }>();
  const phrase: Phrase = JSON.parse(phraseString);

  const [moduleColorIndex, setModuleColorIndex] = useState(0);
  const [progress, setProgress] = useState(0.1);
  const [transcribedText, setTranscribedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { isRecording, startRecording, stopRecording } = useAudioRecording();
  const { playTTS, isLoading } = useOptimizedTTS();

  const progressAnim = new Animated.Value(progress);

  const getLighterShade = (hex: string, percent: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const light = percent / 100;
    const newR = Math.min(255, r + (255 - r) * light);
    const newG = Math.min(255, g + (255 - g) * light);
    const newB = Math.min(255, b + (255 - b) * light);

    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };

  const getDarkerShade = (hex: string, percent: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const dark = percent / 100;
    const newR = Math.max(0, r * (1 - dark));
    const newG = Math.max(0, g * (1 - dark));
    const newB = Math.max(0, b * (1 - dark));

    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };

  useEffect(() => {
    const index = APP_COLORS.moduleNames.findIndex(name => name === module);
    setModuleColorIndex(index !== -1 ? index : 0);
  }, [module]);

  const moduleColor = APP_COLORS.moduleColors[moduleColorIndex];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleNext = () => {
    if (accuracy !== null && accuracy > 70) {
      setProgress((prev) => Math.min(1, prev + 0.1));
      navigation.goBack();
    } else {
      Alert.alert(
        'Keep Practicing',
        'Try to achieve better accuracy before moving to the next phrase.',
        [{ text: 'OK', onPress: () => { } }]
      );
    }
  };

  const handlePlayPhrase = async () => {
    try {
      await playTTS(phrase.translation);

      // Create a temporary file path
      const tempFilePath = FileSystem.documentDirectory + 'temp_audio.wav';

      // Convert blob to base64 using FileReader
      const fr = new FileReader();
      fr.onload = async () => {
        const base64Data = (fr.result as string).split(',')[1];

        // Write the audio data to a temporary file
        await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Play the audio using Expo's Audio API
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync({ uri: tempFilePath });
        await soundObject.playAsync();

        // Clean up after playing
        soundObject.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await soundObject.unloadAsync();
            // Delete the temporary file
            await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
          }
        });
      };

    } catch (error: any) {
      console.error('TTS error:', error);
      Alert.alert(
        'Error',
        'Failed to play audio. Please try again.' + (error.message ? `\n\nDetails: ${error.message}` : '')
      );
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return Math.round((1 - distance / maxLength) * 100);
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitute = matrix[j - 1][i - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0);
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1, // deletion
          matrix[j][i - 1] + 1, // insertion
          substitute // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleStartSpeechRecognition = async () => {
    if (isRecording) {
      const audioFilePath = await stopRecording();

      if (!audioFilePath) {
        Alert.alert('Error', 'Failed to record audio. Please try again.');
        return;
      }

      setIsProcessing(true);
      console.log('Sending audio for transcription:', audioFilePath);

      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', {
          uri: audioFilePath,
          type: 'audio/m4a',
          name: 'recording.m4a',
        } as any);

        // Set the correct headers
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        };

        const response = await api.post('/transcribe/', formData, config);
        const { transcription } = response.data;
        console.log('Received transcription:', transcription);
        setTranscribedText(transcription);

        const expectedText = phrase.translation;
        const similarity = calculateSimilarity(transcription, expectedText);
        console.log('Calculated similarity:', similarity);
        setAccuracy(similarity);
      } catch (error) {
        console.error('Speech recognition error:', error);
        Alert.alert(
          'Error',
          'Failed to process audio. Please check your internet connection and try again.'
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log('Starting recording...');
      startRecording();
    }
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return '#4CAF50';
    if (acc >= 70) return '#FFA726';
    return '#F44336';
  };

  const headerBackground = moduleColor;
  const buttonBackground = moduleColor;
  const buttonTextColor = '#FFFFFF';
  const textColor = '#000000';
  const labelColor = '#000000';
  const progressBarColor = moduleColor;
  const nextButtonColor = accuracy !== null && accuracy > 70 ? getDarkerShade(moduleColor, 20) : '#cccccc';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Header Section */}
      <View style={[styles.headerContainer, { backgroundColor: headerBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Learn This Phrase</Text>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: progressBarColor,
            },
          ]}
        />
      </View>

      <View style={[styles.card, {
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 5,
        borderLeftColor: moduleColor,
        shadowColor: moduleColor
      }]}>
        <Text style={[styles.label, { color: labelColor }]}>English Phrase:</Text>
        <Text style={[styles.value, { color: textColor }]}>{phrase.phrase}</Text>

        <Text style={[styles.label, { color: labelColor }]}>Translation:</Text>
        <Text style={[styles.value, { color: textColor }]}>{phrase.translation}</Text>

        <Text style={[styles.label, { color: labelColor }]}>Pronunciation:</Text>
        <Text style={[styles.value, { color: textColor }]}>{phrase.pronunciation}</Text>

        <Text style={[styles.label, { color: labelColor }]}>Transliteration:</Text>
        <Text style={[styles.value, { color: textColor }]}>{phrase.transliteration}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePlayPhrase}
          style={[styles.button, { backgroundColor: buttonBackground }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={buttonTextColor} />
          ) : (
            <>
              <Ionicons name="volume-high" size={24} color={buttonTextColor} />
              <Text style={[styles.buttonText, { color: buttonTextColor }]}>Listen</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleStartSpeechRecognition}
          style={[
            styles.button,
            { backgroundColor: isRecording ? '#ff4444' : buttonBackground }
          ]}
          disabled={isProcessing}
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color={buttonTextColor} />
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableOpacity>
      </View>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={moduleColor} />
          <Text style={[styles.processingText, { color: '#000000' }]}>Processing audio...</Text>
        </View>
      )}

      {transcribedText && (
        <View style={[styles.transcriptionContainer, {
          backgroundColor: '#FFFFFF',
          borderLeftWidth: 5,
          borderLeftColor: moduleColor,
          shadowColor: moduleColor
        }]}>
          <Text style={[styles.transcriptionLabel, { color: labelColor }]}>Your speech:</Text>
          <Text style={[styles.transcriptionText, { color: textColor }]}>{transcribedText}</Text>
          {accuracy !== null && (
            <View style={styles.accuracyContainer}>
              <Text style={[styles.accuracyText, { color: getAccuracyColor(accuracy) }]}>
                Accuracy: {accuracy}%
              </Text>
              {accuracy >= 70 ? (
                <Ionicons name="checkmark-circle" size={24} color={getAccuracyColor(accuracy)} />
              ) : (
                <Ionicons name="refresh-circle" size={24} color={getAccuracyColor(accuracy)} />
              )}
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={handleNext}
        style={[
          styles.nextButton,
          { backgroundColor: nextButtonColor }
        ]}
      >
        <Text style={styles.nextButtonText}>Next Phrase</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    height: 8,
    width: '90%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 15,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  card: {
    borderRadius: 15,
    padding: 25,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  processingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
  },
  transcriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  transcriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  accuracyText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginRight: 10,
  },
});

export default PhraseLearnScreen;