import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './(auth)';
import HomeScreen from './screens/HomeScreen';
import PhraseListScreen from './screens/PhraseListScreen';
import PhraseLearnScreen from './screens/PhraseLearnScreen';
<<<<<<< Updated upstream
import ChatBot from './screens/ChatBot'
=======
import ChatBot from './screens/ChatBot';
import Login from './(auth)/Login';
import Signup from './(auth)/Signup';
import { Provider } from 'react-redux';
import Store from '../context/store'; 
import ChatScreen from './screens/ChatScreen';
>>>>>>> Stashed changes

export type RootStackParamList = {
<<<<<<< Updated upstream
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
  ChatBot: undefined; 
=======
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  PhraseList: { module: string };
  PhraseLearn: { phrase: { phrase: string; translation: string; transliteration: string }; module: string };
  ChatBot: undefined;
  Community: undefined;
>>>>>>> Stashed changes
};

const Stack = createStackNavigator<RootStackParamList>();

<<<<<<< Updated upstream
const App = () => {
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PhraseList" component={PhraseListScreen} />
        <Stack.Screen name="PhraseLearn" component={PhraseLearnScreen} />
        <Stack.Screen name="ChatBot" component={ChatBot} />
        {/* <Stack.Screen name="Community" component={PhraseLearnScreen} /> */}
      </Stack.Navigator>
  );
};

export default App;
=======
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
>>>>>>> Stashed changes
