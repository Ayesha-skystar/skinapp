import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const NoDetectionScreen = ({ route, navigation }) => {
  // Safely extract parameters with default values
  const { 
    imageUri = null, 
    detection = { disease: 'Unknown', confidence: 0, all_predictions: {} }, 
    message = 'No specific skin condition detected with high confidence', 
    suggestion = 'Please consult a dermatologist for accurate diagnosis' 
  } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SkinScan Analysis</Text>
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      
      <Text style={styles.warningText}>⚠️ {message}</Text>
      
      <View style={styles.resultBox}>
        <Text style={styles.predictionText}>
          Predicted: {detection.disease || 'Unknown'}
        </Text>
        {detection.confidence && (
          <Text style={styles.confidenceText}>
            Confidence: {(detection.confidence * 100).toFixed(1)}%
          </Text>
        )}
      </View>
      
      <Text style={styles.suggestionText}>{suggestion}</Text>
      
      {detection.all_predictions && Object.keys(detection.all_predictions).length > 0 && (
        <View style={styles.predictionsContainer}>
          <Text style={styles.predictionsTitle}>All Predictions:</Text>
          {Object.entries(detection.all_predictions).map(([disease, prob]) => (
            <Text key={disease} style={styles.predictionItem}>
              {disease}: {(prob * 100).toFixed(1)}%
            </Text>
          ))}
        </View>
      )}

      {detection.disease && detection.disease !== 'Unknown' && (
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => navigation.navigate('DiseaseDetail', { disease: detection.disease })}
        >
          <Text style={styles.detailsButtonText}>View {detection.disease} Details</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => navigation.navigate('ScanScreen')}
      >
        <Text style={styles.retryButtonText}>Try Another Image</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 18,
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 16,
    color: '#666',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  predictionsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  predictionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 10,
    textAlign: 'center',
  },
  predictionItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  detailsButton: {
    backgroundColor: '#7F3C88',
    padding: 15,
    borderRadius: 25,
    width: 250,
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    width: 250,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NoDetectionScreen;