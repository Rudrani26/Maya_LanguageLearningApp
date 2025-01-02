import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";

type PhraseCardProps = {
  englishWord: string;
  marathiWord: string;
  pronunciation: string;
  onTestPress: () => void;
};

export default function PhraseCard({
  englishWord,
  marathiWord,
  pronunciation,
  onTestPress,
}: PhraseCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.phraseTitle}>Phrase 1</Text>
      
      <View style={styles.textContainer}>
        <Text style={styles.smallText}>English Word:</Text>
        <Text style={styles.phraseText}>{englishWord}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.smallText}>Marathi Translation:</Text>
        <Text style={styles.phraseText}>{marathiWord}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.smallText}>Pronunciation:</Text>
        <Text style={styles.phraseText}>{pronunciation}</Text>
      </View>

      {/* Audio Placeholder */}
      <View style={styles.audioContainer}>
        <Text style={styles.smallText}>Audio: </Text>
        <Text style={styles.phraseText}>[Audio recording]</Text>
      </View>

      {/* Test Yourself Button */}
      <View style={styles.buttonContainer}>
        <Button title="Test Yourself" onPress={onTestPress} color="#3884fd" />
      </View>

      {/* Transcribed Text */}
      <View style={styles.transcribedTextContainer}>
        <Text style={styles.smallText}>Transcribed Text: </Text>
        <Text style={styles.phraseText}>[Will display here]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 50,
    marginBottom: 50,
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 25,
    width: "90%",
    alignSelf: "center", // Center the card horizontally
  },
  phraseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  smallText: {
    fontSize: 16,
    marginTop: 10,
    color: "#888",
    textAlign: "left",
    marginLeft: 10,
  },
  phraseText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
    textAlign: "left",
    marginLeft: 10,
    fontFamily: "Arial", // Adding a clean font
  },
  textContainer: {
    marginBottom: 15,
  },
  audioContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  transcribedTextContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});
