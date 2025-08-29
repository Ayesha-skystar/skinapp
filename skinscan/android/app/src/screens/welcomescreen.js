//import React from 'react';
import React, { useEffect } from 'react'
import { View,  Text, StyleSheet, ImageBackground } from 'react-native';
export default function WelcomeScreen ({ navigation }) {

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('SecondScreen'); // Navigate to SecondScreen after 4 seconds
    }, 4000);
  }, []);   
  return (
    <ImageBackground 
      source={require('D:/fyp/skinscan/assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to SkinScan!</Text>
        <Text style={styles.subtitle}>Scan. Detect. Protect.</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

//export default welcomescreen;
