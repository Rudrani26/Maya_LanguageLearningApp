import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkRelatedTravel: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work-Related Travel / kaam sambandhi pravas</Text>
      <Text style={styles.content}>
        Useful phrases for business travel and meetings in Marathi.
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

export default WorkRelatedTravel;