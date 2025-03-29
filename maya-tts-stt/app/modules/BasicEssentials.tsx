import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BasicEssentials: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Essentials / moolbhut vishayak</Text>
      <Text style={styles.content}>
        Learn the basics of the Marathi language and essential phrases for daily use.
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

export default BasicEssentials;