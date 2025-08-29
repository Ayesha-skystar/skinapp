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
import ScanScreen from 'D:/fyp/skinscan/android/app/src/screens/scanscreen';
import PrivacyScreen from 'D:/fyp/skinscan/android/app/src/screens/privacyscreen';
import TipScreen from 'D:/fyp/skinscan/android/app/src/screens/tipscreen';
import DetectionResultScreen from 'D:/fyp/skinscan/android/app/src/screens/DetectionResultScreen';//#endregio
import { ThemeProvider } from 'D:/fyp/skinscan/android/app/src/theme/ThemeContext';

import NoDetectionScreen from 'D:/fyp/skinscan/android/app/src/screens/NoDetectionScreen';
//import HistoryItem from 'D:/fyp/skinscan/android/app/src/screens/services/HistoryItem';
//import HistoryService from 'D:/fyp/skinscan/android/app/src/screens/services/historyservices';
const Stack = createStackNavigator();
function MainApp() {  
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
       <Stack.Screen name="TipScreen" component={TipScreen}   />
       <Stack.Screen name="ScanScreen" component={ScanScreen}   />
        <Stack.Screen name="DetectionResultScreen" component={DetectionResultScreen}   />
        <Stack.Screen name="NoDetectionScreen" component={NoDetectionScreen}   />
        
     </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}