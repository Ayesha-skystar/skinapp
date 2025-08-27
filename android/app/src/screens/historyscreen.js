import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, ActivityIndicator, 
  StyleSheet, TouchableOpacity, Alert, RefreshControl,
  SafeAreaView
} from 'react-native';
import HistoryService from 'D:/fyp/skinscan/android/app/src/screens/services/historyservices';

const HistoryScreen = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load initial data
    loadHistory();
    
    // Set up real-time listener
    const unsubscribe = HistoryService.subscribeToHistoryUpdates((items) => {
      setHistoryItems(items);
      setLoading(false);
      setRefreshing(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const loadHistory = async () => {
    try {
      setRefreshing(true);
      const result = await HistoryService.getAllHistory();
      
      if (result.success) {
        setHistoryItems(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteItem = async (id) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const deleteResult = await HistoryService.deleteHistoryItem(id);
            if (!deleteResult.success) {
              Alert.alert('Error', deleteResult.message);
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.diseaseText}>{item.disease}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
      )}
      
      <Text style={styles.dateText}>
        {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  if (loading && !refreshing && historyItems.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F3C88" />
        <Text style={styles.loadingText}>Loading your history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadHistory}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Scan History</Text>
          <Text style={styles.headerSubtitle}>
            {historyItems.length} scan{historyItems.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
        
        <FlatList
          data={historyItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadHistory}
              colors={['#7F3C88']}
              tintColor={'#7F3C88'}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No scan history yet</Text>
              <Text style={styles.emptyText}>
                Your skin scan results will appear here after you save them.
              </Text>
            </View>
          }
          contentContainerStyle={historyItems.length === 0 && styles.emptyListContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EED3EA',
  },
  container: {
    flex: 1,
    backgroundColor: '#EED3EA',
  },
  header: {
    padding: 20,
    backgroundColor: '#EED3EA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
   fontSize: 35,
    fontWeight: 'bold',
    
    marginBottom: 5,
    color: '#7F3C88',

    
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EED3EA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7F3C88',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EED3EA',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7F3C88',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
  },
  itemContainer: {
    backgroundColor: '#EED3EA',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  diseaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F3C88',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7F3C88',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;