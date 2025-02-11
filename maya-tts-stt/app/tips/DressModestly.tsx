import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DressModestly: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dress Modestly at Religious and Cultural Sites / dharmik aani sanskrutik sthanant dhyanat aste</Text>
      <Text style={styles.content}>
        It's important to dress modestly when visiting religious and cultural sites.
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

export default DressModestly;