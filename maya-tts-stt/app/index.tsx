import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PhraseListScreen from './screens/PhraseListScreen';
import PhraseLearnScreen from './screens/PhraseLearnScreen';
import ChatBot from './screens/ChatBot'
import Login from './(auth)/Login';
import Signup from './(auth)/Signup';
import { Provider } from 'react-redux';
import Store from '@/context/store';
import ChatScreen from './screens/ChatScreen';

// Define the RootStackParamList for navigation
export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
  ChatBot: undefined;
  MaryamHome: undefined;
  Community: undefined;
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
      <Stack.Screen name="Community" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default App;