import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Shopping: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping / kharidaari</Text>
      <Text style={styles.content}>
        Learn how to shop and bargain in Marathi while visiting Maharashtra.
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

export default Shopping;