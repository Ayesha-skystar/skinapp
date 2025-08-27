import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Network from 'expo-network';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const ScanScreen = ({ route }) => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    (async () => {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    })();
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

  const { symptoms } = route.params || {};

  const handleCameraPress = async () => {
    animatePress();
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
        setShowOptions(true);
        setError(null);
        setShowRetry(false);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to take photo. Please try again.');
    }
  };

  const handleUploadPress = async () => {
    animatePress();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
        setShowOptions(true);
        setError(null);
        setShowRetry(false);
      }
    } catch (err) {
      console.error('Image selection error:', err);
      setError('Failed to select image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setShowRetry(false);

    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        throw new Error('No internet connection');
      }

      const fileType = image.split('.').pop().toLowerCase();
      const validTypes = ['jpg', 'jpeg', 'png'];
      if (!validTypes.includes(fileType)) {
        throw new Error('Only JPG/PNG images supported');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await axios.post('http://192.168.1.107:8000/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.data.status === 'success') {
        if (response.data.detection.disease === "No specific condition") {
          navigation.navigate('NoDetectionScreen', {
            imageUri: image,
            message: response.data.message,
            suggestion: response.data.suggestion
          });
        } else {
          navigation.navigate('DetectionResultScreen', {
            imageUri: image,
            detection: response.data.detection
          });
        }
      } else {
        throw new Error(response.data.message || 'Detection failed');
      }
    } catch (err) {
      let errorMsg = 'An error occurred during analysis';
      
      if (err.response && err.response.data) {
        if (err.response.data.reasons) {
          errorMsg = err.response.data.message + '\n' + 
                     err.response.data.reasons.join('\n') + '\n\n' +
                     err.response.data.suggestions.join('\n');
        } else {
          errorMsg = err.response.data.message || 'Invalid image';
        }
      } else {
        errorMsg = err.message || 'Please try again with a different image';
      }
      
      setError(errorMsg);
      setShowRetry(true);
      // REMOVED: setImage(null); - This was causing the image to disappear
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setShowOptions(false);
    setError(null);
    setShowRetry(false);
  };

  const retryAnalysis = () => {
    setError(null);
    setShowRetry(false);
    analyzeImage();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {!image ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title with Animation */}
          <Animatable.Text 
            animation="fadeInDown"
            duration={1000}
            style={styles.title}
          >
            SkinScan Analysis
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
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>SkinScan Analysis</Text>

          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>

          {showOptions && !error && !loading && (
            <Animatable.View 
              animation="fadeInUp"
              style={styles.optionsContainer}
            >
              <TouchableOpacity 
                style={styles.smallButton} 
                onPress={resetImage}
              >
                <Text style={styles.smallButtonText}>RETAKE</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.detectButton} 
                onPress={analyzeImage}
                disabled={loading}
              >
                <Text style={styles.detectButtonText}>
                  DETECT IMAGE
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7F3C88" />
              <Text style={styles.loadingText}>Analyzing image...</Text>
            </View>
          )}

          {error && (
            <Animatable.View 
              animation="shake"
              style={styles.errorContainer}
            >
              <Text style={styles.errorText}>{error}</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={resetImage}
                >
                  <Text style={styles.retryButtonText}>TRY AGAIN</Text>
                </TouchableOpacity>
          
                
              </View>
            </Animatable.View>
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
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
  imageContainer: {
    width: '100%',
    height: 350,
    marginBottom: 25,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#D8BFD5',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F8F1F7',
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  smallButton: {
    backgroundColor: '#F8F1F7',
    padding: 15,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E0C9DD',
  },
  smallButtonText: {
    color: '#7F3C88',
    fontSize: 16,
    fontWeight: '600',
  },
  detectButton: {
    padding: 15,
    width: 150,
    backgroundColor: '#7F3C88',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  detectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 15,
    color: '#7F3C88',
    fontSize: 18,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: '#7F3C88',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retakeButton: {
    backgroundColor: '#F8F1F7',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0C9DD',
  },
  retakeButtonText: {
    color: '#7F3C88',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
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