import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Transportation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transportation / parivahan</Text>
      <Text style={styles.content}>
        Understand how to navigate and use transportation in Maharashtra.
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

export default Transportation;