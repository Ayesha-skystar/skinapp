import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const PrivacyScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={40} color="#7F3C88" />
        <Text style={styles.title}>Privacy Policy</Text>
        
      </View>

      {/* Policy Content */}
      <View style={styles.policyContent}>
        <View style={styles.section}>
          <Ionicons name="camera" size={24} color="#7F3C88" style={styles.sectionIcon} />
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>1. Data Collection</Text>
            <Text style={styles.sectionText}>
              We collect user-provided images to analyze skin conditions. 
              No personal data is shared with third parties without your consent.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="analytics" size={24} color="#7F3C88" style={styles.sectionIcon} />
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>2. Data Usage</Text>
            <Text style={styles.sectionText}>
              Uploaded images are used solely for disease detection purposes. 
              We do not store or use your images for any other reason.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="lock-closed" size={24} color="#7F3C88" style={styles.sectionIcon} />
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>3. Security</Text>
            <Text style={styles.sectionText}>
              We implement strong security measures including encryption and 
              secure servers to protect user data from unauthorized access.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="list" size={24} color="#7F3C88" style={styles.sectionIcon} />
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              • To analyze and detect skin conditions{"\n"}
              • To enhance the accuracy of our AI model{"\n"}
              • To improve user experience and app functionality{"\n"}
              • To provide personalized health insights
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="mail" size={24} color="#7F3C88" style={styles.sectionIcon} />
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>5. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about our privacy practices, feel free to contact us.
            </Text>
           
              
           
          </View>
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={24} color="#7F3C88" />
          <Text style={styles.noteText}>
            Your privacy is important to us. We are committed to protecting 
            your personal information and being transparent about our practices.
          </Text>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EED3EA",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7F3C88",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F3C88",
    opacity: 0.8,
  },
  policyContent: {
    width: '100%',
  },
  section: {
    flexDirection: 'row',
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7F3C88",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: "#7F3C88",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  contactButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: "#F8F1F7",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  noteText: {
    fontSize: 14,
    color: "#7F3C88",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: "#7F3C88",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
});

export default PrivacyScreen;