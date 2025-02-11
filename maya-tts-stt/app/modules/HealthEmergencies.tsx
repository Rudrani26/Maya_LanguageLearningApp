import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthEmergencies: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health & Emergencies / aarogya aani aapatki</Text>
      <Text style={styles.content}>
        Essential phrases and steps for handling health issues and emergencies in Marathi.
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

export default HealthEmergencies;