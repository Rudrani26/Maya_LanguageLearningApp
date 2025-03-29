import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvoidStereotypes: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enjoy the Culture but Avoid Stereotypes / sanskrutik manat aste</Text>
      <Text style={styles.content}>
        Enjoy the culture but avoid stereotypes and respect diversity.
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

export default AvoidStereotypes;