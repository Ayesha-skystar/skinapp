import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AboutUsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* About Us Title */}
      <Text style={styles.aboutUsTitle}>About Us</Text>

      {/* About Us Description */}
      <View style={styles.aboutUsBox}>
        <Text style={styles.aboutUsText}>
          At SkinScan, we are dedicated to empowering individuals with
          innovative technology for better health and well-being. Our app is
          designed to assist users in detecting and understanding skin
          conditions quickly and accurately. By combining advanced
          technology with user-friendly design, we aim to make health
          management accessible to everyone.
        </Text>
      </View>

      {/* Back Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("MainScreen")}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EBC8F1",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  aboutUsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    backgroundColor: "#7F3C88",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  aboutUsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  aboutUsText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#7F3C88",
    borderRadius: 20,
    padding: 10,
    width: "30%",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default AboutUsScreen;
