import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Sightseeing: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sightseeing / darshan</Text>
      <Text style={styles.content}>
        Discover popular tourist spots and how to ask for directions in Marathi.
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

export default Sightseeing;