import React from "react";
import { View, StyleSheet } from "react-native";
import PhraseCard from "../components/PhraseCard";

export default function HelloGreeting({ navigation }: any) {
  const handleTestPress = () => {
    // Handle button press for testing
    console.log("Test Yourself pressed!");
  };

  return (
    <View style={styles.container}>
      <PhraseCard
        englishWord="Hello"
        marathiWord="नमस्कार"
        pronunciation="Namaskar"
        onTestPress={handleTestPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
