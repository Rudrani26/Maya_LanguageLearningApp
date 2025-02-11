import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LocalEtiquette: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Etiquette in Rural Areas / gaonancha prakarant sanskrutik sanskrutik sanskrutik</Text>
      <Text style={styles.content}>
        Learn about local etiquette and customs in rural areas.
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

export default LocalEtiquette;