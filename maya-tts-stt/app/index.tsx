// app/index.tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import GreetingsPage from './screens/GreetingsPage'; // Import GreetingsPage

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <GreetingsPage /> {/* Directly render GreetingsPage */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
