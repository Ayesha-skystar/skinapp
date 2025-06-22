import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from 'D:/fyp/skinscan/android/app/src/screens/welcomescreen';
import SecondScreen from 'D:/fyp/skinscan/android/app/src/screens/secondscreen';
import SignUp from 'D:/fyp/skinscan/android/app/src/screens/signup'; 
import SignIn from 'D:/fyp/skinscan/android/app/src/screens/signin';
import MainScreen from 'D:/fyp/skinscan/android/app/src/screens/mainscreen';
import  AboutusScreen from 'D:/fyp/skinscan/android/app/src/screens/aboutusscreen';
import HistoryScreen from 'D:/fyp/skinscan/android/app/src/screens/historyscreen';
import  Acne   from 'D:/fyp/skinscan/android/app/src/screens/acne';
import  Eczema  from 'D:/fyp/skinscan/android/app/src/screens/eczema';
import  Psoriasis  from 'D:/fyp/skinscan/android/app/src/screens/psoriasis';
import Tinearingworm from 'D:/fyp/skinscan/android/app/src/screens/tinearingworm';
import  Warts from 'D:/fyp/skinscan/android/app/src/screens/warts';
import  ForgotScreen from 'D:/fyp/skinscan/android/app/src/screens/forgotscreen';
import PrivacyScreen from 'D:/fyp/skinscan/android/app/src/screens/privacyscreen';

const Stack = createStackNavigator();
export default function App() {  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      
        <Stack.Screen name="SecondScreen" component={SecondScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} /> 
            <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      <Stack.Screen name="PrivacyScreen"  component = {PrivacyScreen}/>
              <Stack.Screen name="AboutusScreen" component={AboutusScreen}   /> 
        <Stack.Screen name="HistoryScreen" component={HistoryScreen}   /> 
        <Stack.Screen name="Acne" component={Acne}   /> 
        <Stack.Screen name="Eczema" component={Eczema} />
        
        <Stack.Screen name="Psoriasis" component={Psoriasis}   />
        <Stack.Screen name="Tinearingworm" component={Tinearingworm}   />
        <Stack.Screen name="Warts" component={Warts}   />
       
        
        
        

      </Stack.Navigator>
      

    </NavigationContainer>
  );
}