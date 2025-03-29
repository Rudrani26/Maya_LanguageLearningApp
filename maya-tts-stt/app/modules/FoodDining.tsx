import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodDining: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food & Dining / khaadya v pinyaache</Text>
      <Text style={styles.content}>
        Explore the local cuisine and learn how to order food in Marathi.
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

export default FoodDining;