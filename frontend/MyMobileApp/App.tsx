import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

console.log('its working!!!1')
const App = () => {
  return (
    
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: 'blue',
  },
});

export default App;
