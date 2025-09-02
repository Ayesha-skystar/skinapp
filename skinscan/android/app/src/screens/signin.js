import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'D:/fyp/skinscan/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (setter) => (value) => {
    setter(value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSignIn = () => {
    setErrorMessage(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          alert('Login Successful!');
          navigation.navigate('MainScreen');
        } else {
          setErrorMessage('Please verify your email before login');
        }
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        // Handle specific Firebase auth errors
        if  (error.code === 'auth/invalid-credential') {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (error.code === 'auth/user-disabled') {
          setErrorMessage('This account has been disabled.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage('No account found with this email.');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if  (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address format.');
        } else {
          setErrorMessage('An error occurred during sign in. Please try again.');
        }
      });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Glad to see you!</Text>

      {/* Email Field */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#CCCCCC"
        keyboardType="email-address"
        value={email}
        onChangeText={handleInputChange(setEmail)}
      />

      {/* Password Field with Visibility Toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={handleInputChange(setPassword)}
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#CCCCCC"
          />
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don't have an account?{' '}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up Now
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginTop: 50,
    marginBottom: 30,
  },
   input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#5A3265',
    marginVertical: 10,
    color: '#FFF',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A3265',
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    color: '#FFF',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#FFF',
  },
  visibilityToggle: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#7F3C88',
    marginVertical: 10,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#7F3C88',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  footer: {
     color: '#FFF',
    fontSize: 14,
    marginTop: 20,
  },
  footerLink: {
    color: '#7F3C88',
    fontWeight: 'bold',
  },
});