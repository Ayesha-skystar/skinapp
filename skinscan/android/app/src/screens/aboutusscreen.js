import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@skinscan.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.skinscan.com');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.aboutUsTitle}>About SkinScan</Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Ionicons name="heart" size={32} color="#7F3C88" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          At SkinScan, we're dedicated to empowering individuals with innovative 
          technology for better skin health. Our AI-powered app helps you detect 
          and understand skin conditions quickly and accurately, making healthcare 
          accessible to everyone.
        </Text>
      </View>

      {/* What We Do Section */}
      <View style={styles.section}>
        <Ionicons name="medical" size={32} color="#7F3C88" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>What We Do</Text>
        <Text style={styles.sectionText}>
          • AI-powered skin condition detection{"\n"}
          • Instant analysis with better handling{"\n"}
          • Educational resources about skin health{"\n"}
          • Secure history tracking of your scans{"\n"}
          • Personalized health recommendations
        </Text>
      </View>

      {/* Team Section */}
      <View style={styles.section}>
        <Ionicons name="people" size={32} color="#7F3C88" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
          Our team is made up of dedicated developers, healthcare professionals, 
          and AI experts working together to create innovative solutions for skin 
          health. We're passionate about using technology to make healthcare more 
          accessible to everyone.
        </Text> 
       
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Ionicons name="mail" size={32} color="#7F3C88" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
          <Ionicons name="mail-outline" size={24} color="#7F3C88" />
          <Text style={styles.contactText}>support@skinscan.com</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
          <Ionicons name="globe-outline" size={24} color="#7F3C88" />
          <Text style={styles.contactText}>www.skinscan.com</Text>
        </TouchableOpacity>
        
        
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Ionicons name="information-circle" size={32} color="#7F3C88" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.infoText}>
          Version: 1.0.0{"\n"}
          Last Updated: April 2025{"\n"}
        
        </Text>
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
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  aboutUsTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7F3C88",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7F3C88",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    textAlign: "center",
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F8F1F7',
    borderRadius: 8,
  },
  teamText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 10,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#F8F1F7',
    borderRadius: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#7F3C88",
    marginLeft: 10,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: "#7F3C88",
    borderRadius: 25,
    padding: 15,
    width: "40%",
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default AboutUsScreen;