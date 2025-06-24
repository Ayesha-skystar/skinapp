import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';

const ScanScreen = ({ navigation }) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleCameraPress = async () => {
    animatePress();
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission required');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      console.log('Photo taken:', result.assets[0].uri);
    }
  };

  const handleUploadPress = async () => {
    animatePress();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission required');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    
    if (!result.canceled) {
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  return (
 
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Title with Animation */}
        <Animatable.Text 
          animation="fadeInDown"
          duration={1000}
          style={styles.title}
        >
          SkinScan!
        </Animatable.Text>

        {/* Camera Section */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.buttonContainer}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              onPress={handleCameraPress}
              style={styles.actionBox}
              activeOpacity={0.7}
            >
              <Image
                source={require('D:/fyp/skinscan/assets/camera.jpg')}
                style={styles.icon}
              />
              <View style={styles.textBox}>
                <Text style={styles.actionText}>CAPTURE PHOTO</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animatable.View>

        {/* Upload Section */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={400}
          style={styles.buttonContainer}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              onPress={handleUploadPress}
              style={styles.actionBox}
              activeOpacity={0.7}
            >
              <Image
                source={require('D:/fyp/skinscan/assets/upload.jpg')}
                style={styles.icon}
              />
              <View style={styles.textBox}>
                <Text style={styles.actionText}>UPLOAD PHOTO</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animatable.View>

        {/* Back Button */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={600}
          style={styles.backButtonContainer}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animated.View>
    
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 50,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  actionBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: 250,
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  textBox: {
    backgroundColor: '#7F3C88',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  backButton: {
    padding: 15,
    width: 200,
    backgroundColor: '#7F3C88',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanScreen;