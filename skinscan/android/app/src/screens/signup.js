import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity , StyleSheet} from 'react-native'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {   auth } from 'D:/fyp/skinscan/firebaseConfig';
export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [emailSent, setEmailSent] = useState(false);
      // Higher Order Functions
  const handleInputChange = (setter) => (value) => {
    setter(value);
    if(errorMessage){
      setErrorMessage(null)
    }
  }
  const handleSignup = () => {
  createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user)
            .then(() => {
              alert('Verification email sent! Please check your inbox')
            })
            .catch((error) => {
              setErrorMessage('Error sending verification email');
            })
            setEmail('');
            setPassword('');
        })
        .catch((error) => {
            const errorMsg = error.message;
            setErrorMessage(errorMsg);
        })
    }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>to get started now</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        onChangeText={handleInputChange(setEmail)}
        value={email}
          
      
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handleInputChange(setPassword)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText= {handleInputChange (setConfirmPassword)}
      />
           {
        errorMessage && (
            <Text>{errorMessage}</Text>
        )
      }
     {
      !emailSent && (
       <TouchableOpacity style={styles.button} onPress={handleSignup}>
               <Text style={styles.buttonText}>Sign Up</Text>
             </TouchableOpacity>
      )
     }
     {
      emailSent && (
        <Text>A verification email has been sent to your email address. Please verify your email before login!</Text>
      )
     }
      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate("SignIn")}
        >
          Sign In Now
        </Text>
      </Text>
    </View>
  );

}
// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EED3EA",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#5A3265",
    marginVertical: 10,
    color: "#FFF",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#7F3C88",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
 
  divider: {
    color: "#FFF",
    marginBottom: 20,
  },
 
   footer: {
    color: '#FFFFFF', // White color for "Already have an account?"
    fontSize: 14,
  },
  footerLink: {
    color: '#5A2A83', // Purple color for "Sign In Now"
    fontWeight: 'bold',
  },
  
});

