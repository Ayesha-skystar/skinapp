import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from 'D:/fyp/skinscan/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Password validation function
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    if (!hasLetter || !hasNumber) {
      return 'Password must contain at least one letter and one number';
    } else if (!hasMinLength) {
      return 'Weak password - Add more characters';
    } else if (password.length < 8) {
      return 'Fair password';
    } else {
      return 'Strong password';
    }
  };

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Higher Order Functions
  const handleInputChange = (setter) => (value) => {
    setter(value);
    if(errorMessage){
      setErrorMessage(null)
    }
  }

  const handleSignup = () => {
    if (!acceptedPrivacy) {
      setErrorMessage("Please accept the Privacy Policy to continue");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Check password strength
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    if (!hasLetter || !hasNumber || !hasMinLength) {
      setErrorMessage("Password must be at least 6 characters with at least one letter and one number");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            alert('Verification email sent! Please check your inbox');
            setEmailSent(true);
          })
          .catch((error) => {
            setErrorMessage('Error sending verification email');
          })
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        // Handle specific Firebase auth errors
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already registered');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address format');
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage('Password is too weak. Use at least 6 characters with letters and numbers');
        } else {
          setErrorMessage('An error occurred during sign up. Please try again.');
        }
      })
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // Determine strength color
  const getStrengthColor = () => {
    if (passwordStrength.includes('Weak')) return '#FF5252';
    if (passwordStrength.includes('Fair')) return '#FFA000';
    if (passwordStrength.includes('Strong')) return '#4CAF50';
    return '#5A3265';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>to get started now</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#CCCCCC"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#CCCCCC"
        keyboardType="email-address"
        onChangeText={handleInputChange(setEmail)}
        value={email}
      />

      {/* Password Input with Visibility Toggle */}
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

      {/* Password Strength Indicator */}
      {password.length > 0 && (
        <View style={styles.passwordStrengthContainer}>
          <Text style={[styles.passwordStrengthText, { color: getStrengthColor() }]}>
            {passwordStrength}
          </Text>
        </View>
      )}

      {/* Password Visual Indicator (dots) */}
      {password.length > 0 && (
        <View style={styles.passwordDotsContainer}>
          {[1, 2, 3, 4].map((dot) => (
            <View
              key={dot}
              style={[
                styles.passwordDot,
                {
                  backgroundColor: dot <= Math.min(4, Math.max(1, Math.floor(password.length / 2))) 
                    ? getStrengthColor() 
                    : '#E0E0E0'
                }
              ]}
            />
          ))}
        </View>
      )}

      {/* Confirm Password Input with Visibility Toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={handleInputChange(setConfirmPassword)}
        />
        <TouchableOpacity 
          style={styles.visibilityToggle}
          onPress={toggleConfirmPasswordVisibility}
        >
          <Ionicons 
            name={isConfirmPasswordVisible ? "eye-off" : "eye"} 
            size={20} 
            color="#CCCCCC" 
          />
        </TouchableOpacity>
      </View>

      {/* Privacy Policy Checkbox */}
      <View style={styles.privacyContainer}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
        >
          <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
            {acceptedPrivacy && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.privacyText}>
            I accept the{' '}
            <Text 
              style={styles.privacyLink}
              onPress={() => navigation.navigate("PrivacyScreen")}
            >
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {!emailSent ? (
        <TouchableOpacity 
          style={[styles.button, !acceptedPrivacy && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={!acceptedPrivacy}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.successText}>
          A verification email has been sent to your email address. Please verify your email before login! Also check the spam folders
        </Text>
      )}

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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#5A3265",
    marginVertical: 10,
    color: "#FFF",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#5A3265",
    borderRadius: 10,
    marginVertical: 10,
    borderRadius: 10,
    color: "#FFF",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: "#FFF",
  },
  visibilityToggle: {
    padding: 10,
  },
  // Password strength styles
  passwordStrengthContainer: {
    width: "100%",
    marginBottom: 5,
  },
  passwordStrengthText: {
    fontSize: 12,
    textAlign: 'left',
  },
  passwordDotsContainer: {
    width: "100%",
    flexDirection: 'row',
    marginBottom: 10,
  },
  passwordDot: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
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
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerLink: {
    color: '#5A2A83',
    fontWeight: 'bold',
  },
  privacyContainer: {
    width: "100%",
    marginVertical: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#7F3C88",
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: "#7F3C88",
    borderColor: "#7F3C88",
  },
  privacyText: {
    color: "#5A3265",
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  privacyLink: {
    color: "#7F3C88",
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: "#FF5252",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  successText: {
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    paddingHorizontal: 10,
  },

});