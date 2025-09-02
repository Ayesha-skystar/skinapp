import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, Text, Image, StyleSheet, ScrollView, 
  TouchableOpacity, Animated, Easing,
  ActivityIndicator, Dimensions, Alert
} from 'react-native';
import HistoryService from 'D:/fyp/skinscan/android/app/src/screens/services/historyservices';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DetectionResultScreen = ({ route }) => {
  const { imageUri, detection = {} } = route.params;
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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
        navigation.navigate('NoDetectionScreen', { disease: detection.disease });
    }
  };

  const handleSaveToHistory = async () => {
    if (!detection?.disease || isSaving) return;

    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const saveResult = await HistoryService.saveToHistory({
        disease: detection.disease,
        imageUri: imageUri,
      });

      if (saveResult.success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
        Alert.alert('Save Issue', saveResult.message || 'Could not save to history');
      }
    } catch (error) {
      setSaveStatus('error');
      Alert.alert('Error', 'An unexpected error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewScan = () => {
    navigation.navigate('ScanScreen');
  };

  const viewHistory = () => {
    navigation.navigate('HistoryScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          }
        ]}>
          <Image source={{ uri: imageUri }} style={styles.resultImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.overlayText}>Detected Condition</Text>
          </View>
        </Animated.View>

        <Animated.View style={[
          styles.resultDetails,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          <View style={styles.diseaseHeader}>
            <Text style={styles.diseaseName}>
              {detection.disease?.toUpperCase() || "UNKNOWN CONDITION"}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={navigateToDiseaseScreen}
              activeOpacity={0.7}
            >
              <Ionicons name="medical" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.detailsButtonText}>
                DISEASE DETAILS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.saveButton,
                
                saveStatus === 'success' && styles.saveButtonSuccess,
                saveStatus === 'error' && styles.saveButtonError
              ]}
              onPress={handleSaveToHistory}
        
            >
              <Ionicons name="save" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.saveButtonText}>SAVE TO HISTORY</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomButtons}>
            <TouchableOpacity 
              style={styles.newScanButton}
              onPress={handleNewScan}
            >
              <Ionicons name="camera" size={20} color="#7F3C88" style={styles.buttonIcon} />
              <Text style={styles.newScanButtonText}>NEW SCAN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.historyButton}
              onPress={viewHistory}
            >
              <Ionicons name="time" size={20} color="#7F3C88" style={styles.buttonIcon} />
              <Text style={styles.historyButtonText}>VIEW HISTORY</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EED3EA',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#7F3C88',
    textAlign: 'center',
    letterSpacing: 1,
  },
  resultImageContainer: {
    width: width - 40,
    height: 300,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
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
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(127, 60, 136, 0.8)',
    padding: 10,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultDetails: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  diseaseHeader: {
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#EED3EA',
    paddingBottom: 20,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7F3C88',
    textAlign: 'center',
    marginBottom: 10,
  },
  actionButtons: {
    marginBottom: 25,
  },
  detailsButton: {
    backgroundColor: '#7F3C88',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#7F3C88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  saveButtonError: {
    backgroundColor: '#FF5252',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  newScanButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7F3C88',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  newScanButtonText: {
    color: '#7F3C88',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  historyButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7F3C88',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  historyButtonText: {
    color: '#7F3C88',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default DetectionResultScreen;