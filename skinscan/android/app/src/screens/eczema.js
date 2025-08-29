import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, ImageBackground, ScrollView } from 'react-native';

// Define color based on the image (you can adjust the RGB values accordingly)
const backgroundColor = '#7F3C99';  // Light blue color for Eczema (you can adjust this color)

const Eczema = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial opacity value

  useEffect(() => {
    // Fade in animation when the component loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
    source={{ uri: 'https://w7.pngwing.com/pngs/867/447/png-transparent-light-violet-purple-lilac-purple-photography-color-magenta-thumbnail.png' }}  // Use your own background image
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Title of the Page */}
        <Text style={styles.title}>Eczema</Text>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Define Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Define</Text>
            <Text style={styles.text}>Eczema is a group of conditions that cause inflammation, redness, and itching of the skin. It is commonly seen in children but can affect people of all ages.</Text>
          </View>

          {/* Causes Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Causes</Text>
            <Text style={styles.text}>The exact cause of eczema is unknown, but it is thought to be related to a combination of genetic and environmental factors, including allergies, irritants, and stress.</Text>
          </View>

          {/* Treatments Section *
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Treatments</Text>
            <Text style={styles.text}>Eczema treatments focus on relieving symptoms. These include moisturizing creams, antihistamines, and corticosteroids. In severe cases, light therapy or immunosuppressants may be used.</Text>
          </View>/}

          {/* Recommendations Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Recommendations</Text>
            <Text style={styles.text}>To manage eczema, use gentle skincare products, avoid triggers, maintain a regular moisturizing routine, and consult a dermatologist for personalized treatment.</Text>
          </View>
        </ScrollView>

        {/* Back Button */}
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

export default Eczema;
