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
export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage]= useState(null);
  const handleInputChange = (setter) => (value) => {
    setter(value);
    if(errorMessage){
      setErrorMessage(null)
    }
  }
  const handleSignIn= () => {

  
  setErrorMessage(null);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      // alert('User registered Successfully!')
      if(user.emailVerified){
          alert('Login Successful!');
          navigation.navigate('MainScreen'  );
      }
      else{
          setErrorMessage('Please verify your email before login')
      }
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
      <Text style={styles.title}>Glad to see you!</Text>

      {/* Email Field */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={handleInputChange(setEmail)}
      />

      {/* Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={handleInputChange(setPassword)}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Text style={styles.eyeIcon}>{isPasswordVisible ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>
      {
        errorMessage && (
            <Text >{errorMessage}</Text>
        )
      }
      {/* Forgot Password */}
      <TouchableOpacity  onPress={() => navigation.navigate('ForgotScreen')}  >
        <Text style={styles.forgotPassword}>Forgot Password?  </Text>
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
    color: '#FFF',
    marginTop: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#FFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#FFF',
    marginVertical: 10,
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
  },
  divider: {
    color: '#FFF',
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