import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';

const TipScreen = ({ navigation }) => {
  const categories = [
    { 
      id: '1',
      name: 'ACNE', 
      image: require('D:/fyp/skinscan/assets/acne.jpg'),
      screen: 'Acne',
      color: '#E17C95',
    },
    { 
      id: '2',
      name: 'ECZEMA', 
      image: require('D:/fyp/skinscan/assets/eczema.jpg'),
      screen: 'Eczema',
      color: '#7F3C88',
    },
    { 
      id: '3',
      name: 'PSORIASIS', 
      image: require('D:/fyp/skinscan/assets/psor.jpg'),
      screen: 'Psoriasis',
      color: '#4A235A',
    },
    { 
      id: '4',
      name: 'TINEA RINGWORM', 
      image: require('D:/fyp/skinscan/assets/tinear.jpg'),
      screen: 'Tinearingworm',
      color: '#9B59B6',
    },
    { 
      id: '5',
      name: 'WARTS', 
      image: require('D:/fyp/skinscan/assets/warts.jpg'),
      screen: 'Warts',
      color: '#8E44AD',
    },
  ];

  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp"
      duration={800}
      delay={index * 200}
      style={styles.categoryContainer}
    >
      <TouchableOpacity
        style={[styles.categoryCard, { borderColor: item.color }]}
        onPress={() => navigation.navigate(item.screen)}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.categoryImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.categoryName, { color: item.color }]}>{item.name}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Title Only */}
        <Text style={styles.title}>Tips & Insights</Text>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Select a category to learn more:</Text>
          
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Go Back Button at Bottom */}
        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </Animated.View>
    
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EED3EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F3C88',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#6c3483',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A235A',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryContainer: {
    width: '48%',
    alignItems: 'center',
  },
  categoryCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#EBC8F1',
    marginBottom: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  goBackButton: {
    backgroundColor: '#7F3C88',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  goBackText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TipScreen;