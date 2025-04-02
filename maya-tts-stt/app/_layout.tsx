import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import Store from '../context/store';

export default function RootLayout() {
  return (
    <Provider store={Store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
