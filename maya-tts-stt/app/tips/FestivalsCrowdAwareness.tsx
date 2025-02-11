import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FestivalsCrowdAwareness: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Festivals and Crowd Awareness / utsav aani bhiit</Text>
      <Text style={styles.content}>
        Be aware of crowds and safety during festivals.
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

export default FestivalsCrowdAwareness;