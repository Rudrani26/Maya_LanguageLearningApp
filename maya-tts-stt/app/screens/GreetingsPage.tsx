// screens/GreetingsPage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GreetingsButton from "../components/GreetingsButton";
import { useRouter } from "expo-router";  // Import useRouter

export default function GreetingsPage() {
  const router = useRouter();  // Initialize the router

  const handlePress = (buttonName: string) => {
    console.log(`${buttonName} pressed`);
    if (buttonName === "Button 1") {
      router.push("/screens/HelloGreeting");  // Correct path to HelloGreeting screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <GreetingsButton title="Hello" onPress={() => handlePress("Button 1")} />
      <GreetingsButton title="Good Morning" onPress={() => handlePress("Button 2")} />
      <GreetingsButton title="Goodbye" onPress={() => handlePress("Button 3")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
});
