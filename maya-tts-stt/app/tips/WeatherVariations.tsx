import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherVariations: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Be Prepared for Weather Variations / vaataavranant tyaay</Text>
      <Text style={styles.content}>
        Be prepared for weather variations and dress accordingly.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherVariations;