// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './src/components/HomePage';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;