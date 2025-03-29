import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Accommodation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accommodation / ashray</Text>
      <Text style={styles.content}>
        Find out where to stay and how to book accommodations in Maharashtra.
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

export default Accommodation;