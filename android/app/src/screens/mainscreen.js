import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  ScrollView, 
  Modal, 
  ImageBackground, 
  Animated, 
  Easing,
  Alert
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import * as Animatable from 'react-native-animatable';

const MainScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.replace("SignIn");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu Icon */}
      <Animatable.View 
        animation="fadeInLeft"
        duration={800}
        style={styles.menuIconContainer}
      >
        <TouchableOpacity
          onPress={() => {
            animatePress();
            setMenuVisible(!menuVisible);
          }}
        >
          <Image
            source={require("D:/fyp/skinscan/assets/menuicon.jpg")}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </Animatable.View>

      {/* Title */}
      <Animatable.Text 
        animation="fadeInDown"
        duration={1000}
        style={styles.title}
      >
        SkinScan!
      </Animatable.Text>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Start Scan */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.iconWrapper}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              style={styles.iconBox}
              onPress={() => {
                animatePress();
                navigation.navigate('ScanScreen');
              }}
              activeOpacity={0.7}
            >
              <Image 
                source={require('D:/fyp/skinscan/assets/scan1.jpg')} 
                style={styles.mainIcon}
              />
              <View style={styles.textBox}>
                <Text style={styles.iconText}>START SCAN</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animatable.View>

        {/* Tips & Insights */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={400}
          style={styles.iconWrapper}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              style={styles.iconBox}
              onPress={() => {
                animatePress();
                navigation.navigate('TipScreen');
              }}
              activeOpacity={0.7}
            >
              <Image 
                source={require('D:/fyp/skinscan/assets/tips.jpg')} 
                style={styles.mainIcon}
              />
              <View style={styles.textBox}>
                <Text style={styles.iconText}>TIPS & INSIGHTS</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animatable.View>

        {/* History */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={600}
          style={styles.iconWrapper}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              style={styles.iconBox}
              onPress={() => {
                animatePress();
                navigation.navigate('HistoryScreen');
              }}
              activeOpacity={0.7}
            >
              <Image 
                source={require('D:/fyp/skinscan/assets/history.jpg')} 
                style={styles.mainIcon}
              />
              <View style={styles.textBox}>
                <Text style={styles.iconText}>HISTORY</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animatable.View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ImageBackground
            source={require("D:/fyp/skinscan/assets/ribbon.jpg")}
            style={styles.menuContainer}  
            resizeMode="contain"
          >
            <View style={styles.menuContent}>
              
              <TouchableOpacity 
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("AboutusScreen");
                }}
              >
                <Text style={styles.menuItem}>About us</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity 
                onPress={() => {
                  setMenuVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.menuItem}>Log Out</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("PrivacyScreen");
                }}
              >
                <Text style={styles.menuItem}>PrivacyPolicy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EED3EA',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  menuIconContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuIcon: {
    width: 40,
    height: 40,
    tintColor: '#8A2BE2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7F3C88',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    textShadowColor: 'rgba(138, 43, 226, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  iconWrapper: {
    marginVertical: 15,
    width: '80%',
    alignSelf: 'center',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  mainIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  textBox: {
    backgroundColor: '#7F3C88',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#f9b8cb',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A235A',
    textAlign: 'center',
    width: 170,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e17c95',
    padding: 10,
    borderRadius: 10,
    width: 160,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;