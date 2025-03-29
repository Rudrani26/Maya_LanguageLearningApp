import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FootwearRules: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Footwear Rules in Homes and Temples / gharancha mandoancha niyam</Text>
      <Text style={styles.content}>
        Respect footwear rules in homes and temples.
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

export default FootwearRules;