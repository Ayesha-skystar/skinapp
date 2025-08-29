 import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, Text, Image, StyleSheet, ScrollView, 
  TouchableOpacity, Alert, Animated, Easing,
  ActivityIndicator, Modal
} from 'react-native';
import HistoryService from 'D:/fyp/skinscan/android/app/src/screens/services/historyservices';

const DetectionResultScreen = ({ route}) => {
  const { imageUri, message,  suggestion, detection = {} } = route.params;
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const alertShown = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const navigateToDiseaseScreen = () => {
    if (!detection?.disease) return;
    
    switch(detection.disease.toLowerCase()) {
      case 'psoriasis':
        navigation.navigate('Psoriasis');
        break;
      case 'acne':
        navigation.navigate('Acne');
        break;
      case 'eczema':
        navigation.navigate('Eczema');
        break;
      case 'tinea ringworm':
        navigation.navigate('Tinearingworm');
        break;
      case 'warts molluscum':
        navigation.navigate('Warts');
        break;
      default:
        navigation.navigate('GenericDiseaseDetail', { disease: detection.disease });
    }
  };

  const handleSaveToHistory = async () => {
    if (!detection?.disease) {
      Alert.alert('Error', 'No disease detection results to save');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    
    try {
      // Start the save operation
      const savePromise = HistoryService.saveToHistory({
        disease: detection.disease,
        imageUri: imageUri,
      });

      // Minimum 2 second loading period
      const [saveResult] = await Promise.all([
        savePromise,
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 second minimum
      ]);

      if (saveResult.success) {
        setSaveSuccess(true);
        // Show alert message
        Alert.alert('Success', 'Scan saved successfully to your history!');
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        Alert.alert('Error', saveResult.message || 'Failed to save scan');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderBoundingBox = () => {
    if (!detection?.bbox) return null;
    
    const bbox = detection.bbox;
    const [x1, y1, x2, y2] = Array.isArray(bbox) 
      ? bbox 
      : [bbox.x1, bbox.y1, bbox.x2, bbox.y2];
      
    return (
      <Animated.View style={[
        styles.boundingBox,
        {
          left: `${x1 * 100}%`,
          top: `${y1 * 100}%`,
          width: `${(x2 - x1) * 100}%`,
          height: `${(y2 - y1) * 100}%`,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Text style={styles.boundingBoxLabel}>{detection.disease}</Text>
      </Animated.View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.resultContainer}>
      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={saveSuccess}
        onRequestClose={() => setSaveSuccess(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>✅ Scan saved successfully!</Text>
          </View>
        </View>
      </Modal>

      <Animated.Text style={[
        styles.resultTitle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }]
        }
      ]}>
        SKIN SCAN ANALYSIS
      </Animated.Text>
      
      <Animated.View style={[
        styles.resultImageContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Image source={{ uri: imageUri }} style={styles.resultImage} />
        {renderBoundingBox()}
      </Animated.View>

      <Animated.View style={[
        styles.resultDetails,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }]
        }
      ]}>
        <Text style={styles.diseaseName}>
          {detection.disease?.toUpperCase() || "UNKNOWN CONDITION"}
        </Text>
         
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={navigateToDiseaseScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>
              DISEASE DETAILS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              isSaving && styles.saveButtonDisabled
            ]}
            onPress={handleSaveToHistory}
            disabled={isSaving}
          >
            {isSaving ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.saveButtonText}>Save</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>SAVE TO HISTORY</Text>
            )}
          </TouchableOpacity>
        </View>
       
      
      
    
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    padding: 20,
    backgroundColor: '#EED3EA',
    flexGrow: 1,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#7F3C88',
    textAlign: 'center',
    textShadowColor: 'rgba(138, 43, 226, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultImageContainer: {
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
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#7F3C88',
    backgroundColor: 'rgba(127, 60, 136, 0.15)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 4,
  },
  boundingBoxLabel: {
    backgroundColor: '#7F3C88',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 10,
    overflow: 'hidden',
  },
  resultDetails: {
    backgroundColor: '#F8F1F7',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E0C9DD',
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F3C88',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonGroup: {
    marginTop: 15,
  },
  detailsButton: {
    backgroundColor: '#7F3C88',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#6A3373',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: '#7F3C88',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#6A3373',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#9E69A6',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F3C88',
  },
  messageContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#7F3C88',
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestion: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
   button: {
    backgroundColor: '#7F3C88',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetectionResultScreen; 