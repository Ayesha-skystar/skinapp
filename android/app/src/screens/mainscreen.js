
import React, { useState  } from "react";

import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView,Modal,FlatList , Alert, Platform, ImageBackground  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AcneImage from 'D:/fyp/skinscan/assets/acne.jpg';  
import EczemaImage from 'D:/fyp/skinscan/assets/eczema.jpg';
import PsoriasisImage from 'D:/fyp/skinscan/assets/psor.jpg';
import TinearingwormImage from 'D:/fyp/skinscan/assets/tinear.jpg';
import WartsImage from 'D:/fyp/skinscan/assets/warts.jpg';
//import {   handleLogout} from "firebase/auth ";





const MainScreen = ({ navigation }) => {
   const [menuVisible, setMenuVisible] = useState(false); 
   const [imageUri, setImageUri] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

   // Request permissions for the camera
   const requestCameraPermission = async () => {
if (Platform.OS === 'android') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is required to take photos.');
        return false;
      }
    }
    return true;
  };

  // Function to open the camera and take a picture
  const handleCameraAccess = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setCapturedImage(result.assets[0].uri); // Store the captured image URI
    }
  };
    const pickImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        Alert.alert("Permission Denied", "You need to allow access to your gallery!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImages((prevImages) => [...prevImages, result.uri]);
      }
    };
    
      const categories = [
        { name: 'ACNE', source: AcneImage, screen: 'Acne' },// onPress: () => navigation.navigate("Acne")  },  
        { name: 'ECZEMA', source: EczemaImage,screen: 'Eczema' },
        { name: 'PSORIASIS', source: PsoriasisImage,screen: 'Psoriasis'},
        { name: 'TINEARINGWORM', source: TinearingwormImage, screen: 'Tinearingworm'  },
        { name: 'WARTS MOLL', source: WartsImage , screen: 'Warts'},
      ];  
      const renderItem = ({ item }) => (
        <TouchableOpacity
          style={styles.categoryContainer}
          onPress={() => navigation.navigate(item.screen)} // Navigate to corresponding screen
        >
          <Image source={item.source} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      );
         
  
  
  const handleLogout = async () => {
    console.log("Logout button pressed");
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
         Alert.alert("Logged Out", "You have been logged out.");
      navigation.replace("SignIn"); // ✅ Navigate to Login screen
      // Navigate to login screen if needed
      // For example: navigation.replace('Login');
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>

<Text style={styles.title}>SkinScan!</Text>
<Text style={styles.welcome}>welcome! </Text>

       {/* Menu Line (Icon) */}
       <TouchableOpacity
      style={styles.menuIconContainer}
 onPress={() => setMenuVisible(!menuVisible)} // Toggle menu visibility
       >
         <Image
           source={require("D:/fyp/skinscan/assets/menuicon.jpg")}
           style={styles.menuIcon}
         />
       </TouchableOpacity>
 
       {/* Toggle Menu Modal */}
       <Modal
         transparent={true}
         visible={menuVisible}
         animationType="slide"
         onRequestClose={() => setMenuVisible(false)}
       >   <View style={styles.modalOverlay}>

<ImageBackground
            source={require("D:/fyp/skinscan/assets/ribbon.jpg")}
            style={styles.menuContainer}  
            //style={styles.backgroundImage}
            resizeMode="contain"
            
          >
                
                   <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                     <Text style={styles.menuItem}>Home</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => navigation.navigate("AboutusScreen")}>
                     <Text style={styles.menuItem}>About us</Text>
                       </TouchableOpacity>
                       <TouchableOpacity onPress={handleLogoutfeed}>
                     <Text style={styles.menuItem}>Log Out    </Text>
                       </TouchableOpacity>
                       <TouchableOpacity onPress={() => navigation.navigate("PrivacyScreen")}>
                     <Text style={styles.menuItem}>PrivacyPolicy</Text>
                       </TouchableOpacity>
                   <TouchableOpacity
                     onPress={() => setMenuVisible(false)}
                     style={styles.closeButton}
                   >
                     <Text style={styles.closeText}>Close</Text>
                   </TouchableOpacity>
                   </ImageBackground>
                 </View>
              </Modal>
      <View style={styles.cameraContainer}>
         <View style={styles.cameraSection}>
                {capturedImage ? (
                  <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
                ) : (
                  <Text style={styles.noImageText}> </Text>
                )}
              </View>
      <TouchableOpacity onPress={handleCameraAccess}>
        
        <Image
          source={require('D:/fyp/skinscan/assets/camera.jpg')}
          style={styles.cameraIcon}
        />
      </TouchableOpacity>
    {/* Button to Open Camera */}
                   <TouchableOpacity style={styles.captureButton} onPress={handleCameraAccess}>
                     <Text style={styles.captureButtonText}>Capture Photo</Text>
                   </TouchableOpacity>
                 </View>
      
      {/* Categories Section */}
      <Text style={styles.categoriesTitle}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => navigation.navigate(category.screen)} // Navigate to respective screen
          >
            <Image source={category.source} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
           {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.bottomButton}>
          <Image
            source={require('D:/fyp/skinscan/assets/upload.jpg') }   
            style={styles.bottomButtonIcon} 
             /> <Text style={styles.bottomButtonText}>UPLOAD</Text>
           </TouchableOpacity>
        <TouchableOpacity  onPress={() => navigation.navigate('HistoryScreen')} style={styles.bottomButton}>
          <Image
            source={require('D:/fyp/skinscan/assets/history.jpg')}
            style={styles.bottomButtonIcon} 
          />
          <Text style={styles.bottomButtonText}>HISTORY</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EBC8F1',
    alignItems: 'center',
    paddingVertical: 20,
  },
  menuContent: {
    flex: 1, // Ensures content takes up available space
    justifyContent: "center", // Center menu items
    alignItems: "center", 
    padding: 20,
  },
  
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
   
  menuItem: {
    backgroundColor: "#f9b8cb",
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A235A",
    textAlign: "center",
  },
  menuIcon: {
    width: 60,
    height: 60,
  },
  modalOverlay: {
    
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    //color: 'white',
      width: "100%", // Full width
      height: "100%", // Full height
      borderRadius: 10,
      overflow: "hidden", // Ensures rounded corners apply to the image
      justifyContent: "center", // Center content vertically
      alignItems: "center", // Center content horizontally
      //color:'white',
    },

  menuIconContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    //color: 'white',
  },
 
  closeButton: {
    marginTop: 20,
    backgroundColor: "#e17c95",
    padding: 10,
    borderRadius: 10,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    fontFamily: 'serif',
  },
  welcome: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'serif',
  },
  cameraContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: '#7F3C88',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  captureText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F3C88',
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    flexWrap: 'wrap',
  },
  categoryItem: {
    alignItems: 'center',
    margin: 10,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F3C88',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
  },
  bottomButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  bottomButtonIcon: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7F3C88',
  },
});

export default    MainScreen;

