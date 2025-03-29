import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TechSupport: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tech Support / technikal samaarthan</Text>
      <Text style={styles.content}>
        Learn technical terms and how to ask for tech support in Marathi.
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

export default TechSupport;