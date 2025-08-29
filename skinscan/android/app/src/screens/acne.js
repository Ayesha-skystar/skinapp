
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, ImageBackground, ScrollView } from 'react-native';

// Define color based on the image 
const backgroundColor = '#7F3C99';  

const AcneScreen = ({ navigation }) => {
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
      //source={require("C:/FINAL YEAR PROJECT/skinscan/assets/ribbon.jpg")}
      source={{ uri: 'https://w7.pngwing.com/pngs/867/447/png-transparent-light-violet-purple-lilac-purple-photography-color-magenta-thumbnail.png' }}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Title of the Page */}
        <Text style={styles.title}>Acne</Text>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Define Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Define</Text>
            <Text style={styles.text}>Acne is a skin condition characterized by pimples, blackheads, and cysts that appear on the skin's surface, primarily affecting the face, chest, and back.</Text>
          </View>

          {/* Causes Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Causes</Text>
            <Text style={styles.text}>Acne is caused by clogged hair follicles due to excess oil production, dead skin cells, or bacteria. Hormonal changes, diet, and stress can also contribute to its development.</Text>
          </View>

          {/* Treatments Section *
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Treatments</Text>
            <Text style={styles.text}>Treatments for acne include topical medications, oral medications, and sometimes procedures like laser therapy or chemical peels.</Text>
          </View>/}

          {/* Recommendations Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Recommendations</Text>
            <Text style={styles.text}>To prevent acne, maintain a healthy skincare routine, avoid picking at pimples, and consult a dermatologist for personalized advice.</Text>
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
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    padding: 15,
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

export default AcneScreen;
