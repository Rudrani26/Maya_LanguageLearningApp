import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FortEtiquette: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Be Mindful of Fort Etiquette / kil燕aant manat aste</Text>
      <Text style={styles.content}>
        Be mindful of etiquette when visiting forts and historical sites.
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

export default FortEtiquette;