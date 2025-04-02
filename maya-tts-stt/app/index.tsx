import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './(auth)';
import HomeScreen from './screens/HomeScreen';
import PhraseListScreen from './screens/PhraseListScreen';
import PhraseLearnScreen from './screens/PhraseLearnScreen';
import ChatBot from './screens/ChatBot'
import Store from '@/context/store';
import { Provider } from 'react-redux';
import Login from './(auth)/Login';
import Signup from './(auth)/Signup';
import ChatScreen from './screens/ChatScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
  ChatBot: undefined;
  Community: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PhraseList" component={PhraseListScreen} />
    <Stack.Screen name="PhraseLearn" component={PhraseLearnScreen} />
    <Stack.Screen name="ChatBot" component={ChatBot} />
    <Stack.Screen name="Community" component={ChatScreen} />
  </Stack.Navigator>
);

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={Store}>
    {children}
  </Provider>
);
