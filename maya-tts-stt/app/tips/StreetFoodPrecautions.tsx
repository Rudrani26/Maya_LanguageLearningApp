import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StreetFoodPrecautions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Street Food Precautions / rastaant khaadyancha upay</Text>
      <Text style={styles.content}>
        Take precautions when eating street food.
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

export default StreetFoodPrecautions;