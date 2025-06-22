import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, ImageBackground, ScrollView } from 'react-native';

// Define color based on the image (adjusted for Tinea Ringworm)
const backgroundColor = '#7F3C99'; 

const Tinearingworm = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial opacity value
  const [shakeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10, 
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <ImageBackground
      source={{ uri: 'https://w7.pngwing.com/pngs/867/447/png-transparent-light-violet-purple-lilac-purple-photography-color-magenta-thumbnail.png' }}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { transform: [{ translateY: shakeAnim }] }]}>
        
        <Text style={styles.title}>Tinea Ringworm</Text>
        
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Define</Text>
            <Text style={styles.text}>Tinea Ringworm is a common fungal infection that affects the skin, scalp, or nails. Despite its name, it is not caused by worms but by dermatophyte fungi. It appears as red, circular, scaly rashes with clearer skin in the center.</Text>
          </View>

          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Causes</Text>
            <Text style={styles.text}>Tinea Ringworm is caused by dermatophytes, fungi that thrive in warm and moist environments. It spreads through direct skin contact, contaminated surfaces, shared personal items, and even from infected animals.</Text>
          </View>

         {/* <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Treatments</Text>
            <Text style={styles.text}>Treatment includes antifungal creams, powders, or oral medications. Keeping the affected area clean and dry is crucial. Severe infections may require prescription antifungal treatment from a healthcare provider.</Text>
          </View> */}

          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Recommendations</Text>
            <Text style={styles.text}>To prevent Tinea Ringworm, maintain proper hygiene, 
              avoid sharing personal items, and wear breathable clothing. If infected, avoid 
              scratching to prevent spreading the infection to other parts of the body.</Text>
          </View>
        </ScrollView>

        <View style={styles.backButtonContainer}>
          <Button 
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={backgroundColor}
          />
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: backgroundColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  smallBox: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    paddingBottom: 60,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: backgroundColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: backgroundColor,
    lineHeight: 22,
    textAlign: 'justify',
  },
  backButtonContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderRadius: 5,
  },
});

export default Tinearingworm;
