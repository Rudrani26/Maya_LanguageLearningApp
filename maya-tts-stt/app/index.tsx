// // app/index.tsx
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaView, StyleSheet } from 'react-native';
// import GreetingsPage from './screens/GreetingsPage'; // Import GreetingsPage

// export default function Index() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="auto" />
//       <GreetingsPage /> {/* Directly render GreetingsPage */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PhraseListScreen from './screens/PhraseListScreen';
import PhraseLearnScreen from './screens/PhraseLearnScreen';

// Define the RootStackParamList for navigation
export type RootStackParamList = {
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PhraseList" component={PhraseListScreen} />
        <Stack.Screen name="PhraseLearn" component={PhraseLearnScreen} />
      </Stack.Navigator>
  );
};

export default App;
