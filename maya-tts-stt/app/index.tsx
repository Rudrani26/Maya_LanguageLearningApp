import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PhraseListScreen from './screens/PhraseListScreen';
import PhraseLearnScreen from './screens/PhraseLearnScreen';
import ChatBot from './screens/ChatBot'
import Login from './(auth)/Login';
import Signup from './(auth)/Signup';

// Define the RootStackParamList for navigation
export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
  ChatBot: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PhraseList" component={PhraseListScreen} />
      <Stack.Screen name="PhraseLearn" component={PhraseLearnScreen} />
      <Stack.Screen name="ChatBot" component={ChatBot} />

      {/* <Stack.Screen name="Community" component={PhraseLearnScreen} /> */}
    </Stack.Navigator>
  );
};

export default App;
