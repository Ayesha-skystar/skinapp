import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
     export default function SecondScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('D:/fyp/skinscan/assets/background2.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Do You already have an account?</Text>
        <View style={styles.buttonContainer}>
             {/* Navigate to SignUpScreen */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText} onPress={() => navigation.navigate('SignUp')}> Sign Up  </Text> 
          </TouchableOpacity>
          {/* Navigate to SignInScreen */}
          <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.buttonText} onPress={() => navigation.navigate('SignIn')}>Sign In </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    color: '#2B0E3D',
    fontWeight: '600',
    marginBottom: 45,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 45,
    marginRight: 10,
    marginLeft: 15,
    width: '65%',
  },
  button: {
    backgroundColor: '#2B0E3D',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
