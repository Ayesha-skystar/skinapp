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

const Psoriasis = ({ navigation }) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
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
        style={[styles.container, { transform: [{ translateY: scaleAnim }] }]}
      >
        {/* Title */}
        <Text style={styles.title}>Psoriasis</Text>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Define Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Define</Text>
            <Text style={styles.text}>
              Psoriasis is a chronic autoimmune condition that causes the rapid
              growth of skin cells, leading to thick, scaly patches on the skin.
              It commonly affects the scalp, elbows, knees, and lower back.
            </Text>
          </View>

          {/* Causes Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Causes</Text>
            <Text style={styles.text}>
              Psoriasis is caused by an overactive immune system that speeds up
              skin cell production. Triggers may include stress, infections,
              medications, and environmental factors.
            </Text>
          </View>

          {/* Treatments Section *
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Treatments</Text>
            <Text style={styles.text}>
              Psoriasis treatments include topical creams, phototherapy, and
              systemic medications. Biologic drugs may be prescribed for severe
              cases to suppress immune system activity.
            </Text>
          </View>/}

          {/* Recommendations Section */}
          <View style={styles.smallBox}>
            <Text style={styles.subTitle}>Recommendations</Text>
            <Text style={styles.text}>
              To manage psoriasis, moisturize regularly, avoid triggers, manage
              stress, and follow your dermatologist’s prescribed treatment plan.
            </Text>
          </View>
        </ScrollView>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <Button title="Go Back" onPress={() => navigation.goBack()} color={backgroundColor} />
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensure full height
    width: "100%",
  },
  container: {
    flex: 1, // Allow it to expand fully
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
    flexGrow: 1, // Fix scroll issue
    paddingBottom: 50, // Ensure enough space for scrolling
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

export default Psoriasis;
