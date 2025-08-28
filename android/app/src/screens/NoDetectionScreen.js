import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const NoDetectionScreen = ({ route, navigation }) => {
  const { imageUri, message, suggestion } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis Results</Text>
      
      <Image source={{ uri: imageUri }} style={styles.image} />
      
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.suggestion}>{suggestion}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ScanScreen')}
      >
        <Text style={styles.buttonText}>TRY AGAIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#7F3C88',
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestion: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7F3C88',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NoDetectionScreen;