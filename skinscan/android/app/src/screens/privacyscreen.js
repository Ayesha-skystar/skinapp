import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PrivacyScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      < View style={styles.Button}>
        <Text style={styles.ButtonText}>Privacy Policy</Text>
        </View>
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>1. Data Collection</Text>
          <Text style={styles.sectionText}>
            We collect user-provided images to analyze skin conditions. No personal data is shared with third parties.
          </Text>
        </View>
        
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>2. Data Usage</Text>
          <Text style={styles.sectionText}>
            Uploaded images are used solely for disease detection purposes. We do not store or use your images for any other reason.
          </Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>3. Security</Text>
          <Text style={styles.sectionText}>
            We implement strong security measures to protect user data from unauthorized access.
          </Text>
        </View> 
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>  4. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
          - To analyze and detect diseases.
          {'\n'}- To enhance the accuracy of our AI model.
          {'\n'}- To improve user experience and app functionality.
          </Text>
        </View>
       <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions, feel free to contact us at support@skinscan.com.
        </Text>
        </View>
      

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EBC8F1",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  policyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#7F3C88",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7F3C88",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
  },
  backButton: {
    backgroundColor: "#7F3C88",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  Button: {
    backgroundColor: "#7F3C88",
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    maxWidth: 400,
    elevation: 10,
  },
  ButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default PrivacyScreen;
