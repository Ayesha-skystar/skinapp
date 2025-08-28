import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  ImageBackground,
  ScrollView,
} from "react-native";

const backgroundColor = "#7F3C99"; // Background theme color

const Warts = ({ navigation }) => {
  const [slideAnim] = useState(new Animated.Value(500));

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0, // Move to the original position
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://w7.pngwing.com/pngs/867/447/png-transparent-light-violet-purple-lilac-purple-photography-color-magenta-thumbnail.png",
      }}
      style={styles.background}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Title */}
        <Text style={styles.title}>Warts</Text>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Define Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Define</Text>
            <Text style={styles.text}>
              Warts are small, benign growths on the skin caused by a viral
              infection with the human papillomavirus (HPV). They are often
              rough and can appear anywhere on the body, including hands, feet,
              and face.
            </Text>
          </View>

          {/* Causes Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Causes</Text>
            <Text style={styles.text}>
              Warts are caused by the human papillomavirus (HPV). The virus
              enters the skin through cuts or abrasions, leading to rapid growth
              of skin cells, which forms a wart. Warts can spread from person to
              person or from contact with contaminated surfaces.
            </Text>
          </View>

          {/* Treatments Section *
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Treatments</Text>
            <Text style={styles.text}>
              Common treatments for warts include topical treatments with
              salicylic acid, cryotherapy (freezing), and minor surgical
              removal. In some cases, laser therapy or immunotherapy may be
              recommended for persistent warts.
            </Text>
          </View>/}

          {/* Recommendations Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Recommendations</Text>
            <Text style={styles.text}>
              To prevent warts, avoid direct contact with warts from others,
              wear sandals in public showers, and avoid picking at existing
              warts. If warts do not go away with over-the-counter treatments,
              consult a healthcare provider.
            </Text>
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
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: backgroundColor,
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 50, // Prevents content from getting cut off
  },
  smallBox: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: backgroundColor,
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: backgroundColor,
    lineHeight: 22,
    textAlign: "justify",
  },
  backButtonContainer: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderRadius: 5,
  },
});

export default Warts;
