import React, { useContext, useState } from 'react';
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
  Alert,
  ActivityIndicator
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import * as Animatable from 'react-native-animatable';
import { Switch } from 'react-native-paper';
import { ThemeContext } from 'D:/fyp/skinscan/android/app/src/theme/ThemeContext';

const MainScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  if (!theme?.colors) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Menu Icon */}
      <Animatable.View animation="fadeInLeft" duration={800} style={styles.menuIconContainer}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Image
            source={require("D:/fyp/skinscan/assets/menuicon.jpg")}
            style={[styles.menuIcon, { tintColor: theme.colors.primary }]}
          />
        </TouchableOpacity>
      </Animatable.View>

      {/* Theme Toggle */}
      <View style={styles.themeToggleContainer}>
        <Switch value={isDark} onValueChange={toggleTheme} color={theme.colors.primary} />
      </View>

      {/* Title */}
      <Animatable.Text 
        animation="fadeInDown"
        duration={1000}
        style={[
          styles.title, 
          { 
            color: theme.colors.primary,
            textShadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(138,43,226,0.3)'
          }
        ]}
      >
        SkinScan!
      </Animatable.Text>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* START SCAN */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <TouchableOpacity 
            style={[
              styles.cardContainer,
              { backgroundColor: theme.colors.cardBackground }
            ]}
            onPress={() => navigation.navigate('ScanScreen')}
            activeOpacity={0.7}
          >
            <Image source={require('D:/fyp/skinscan/assets/scan1.jpg')} style={styles.cardIcon} />
            <View style={[styles.textBox, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.iconText, { color: theme.colors.cardBackground }]}>
                START SCAN
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* TIPS & INSIGHTS */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <TouchableOpacity 
            style={[
              styles.cardContainer,
              { backgroundColor: theme.colors.cardBackground }
            ]}
            onPress={() => navigation.navigate('TipScreen')}
            activeOpacity={0.7}
          >
            <Image source={require('D:/fyp/skinscan/assets/tips.jpg')} style={styles.cardIcon} />
            <View style={[styles.textBox, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.iconText, { color: theme.colors.cardBackground }]}>
                TIPS & INSIGHTS
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* HISTORY */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <TouchableOpacity 
            style={[
              styles.cardContainer,
              { backgroundColor: theme.colors.cardBackground }
            ]}
            onPress={() => navigation.navigate('HistoryScreen')}
            activeOpacity={0.7}
          >
            <Image source={require('D:/fyp/skinscan/assets/history.jpg')} style={styles.cardIcon} />
            <View style={[styles.textBox, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.iconText, { color: theme.colors.cardBackground }]}>
                HISTORY
              </Text>
            </View>
          </TouchableOpacity>
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
              <TouchableOpacity onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AboutusScreen");
              }}>
                <Text style={styles.menuItem}>About us</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}>
                <Text style={styles.menuItem}>Log Out</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => {
                setMenuVisible(false);
                navigation.navigate("PrivacyScreen");
              }}>
                <Text style={styles.menuItem}>PrivacyPolicy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
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
    paddingTop: 50,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    width: '75%',
    alignSelf: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardIcon: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  textBox: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 30,
    marginTop: 5,
    width: '75%',
    alignItems: 'center',
    
    
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 160,
  },
});

export default MainScreen;