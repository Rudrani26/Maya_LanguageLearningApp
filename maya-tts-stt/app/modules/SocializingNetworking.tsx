import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SocializingNetworking: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Socializing & Networking / saamaajik aani netvaarking</Text>
      <Text style={styles.content}>
        Learn how to make friends and network in social situations in Marathi.
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

export default SocializingNetworking;