import { historyFirestore } from 'D:/fyp/skinscan/firebase.history.config';
import { collection, addDoc, getDocs, getDocsFromCache, onSnapshot, doc, deleteDoc , serverTimestamp } from 'firebase/firestore';
//import HistoryItem from 'D:/fyp/skinscan/model/HistoryItem'
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const HistoryService = {
  async saveToHistory(data) {
    try {
      const docRef = await addDoc(collection(historyFirestore, "scans"), {
        ...data,
        timestamp: new Date()
      });
      // Return success with additional data
      return { 
        success: true, 
        id: docRef.id,
        message: 'Successfully saved to history'
      };
    } catch (error) {
      console.error("Save error:", error);
      
      // Return specific error messages based on error type
      let message = 'Failed to save scan';
      if (error.code === 'permission-denied') {
        message = 'You dont have permission to save';
      } else if (error.code === 'unavailable') {
        message = 'Network unavailable. Please check connection';
      }
      
      return { 
        success: false, 
        message: message,
        error: error 
      };
    }
  },

  async getAllHistory() {
    try {
      // First try to get cached data for instant display
      const cacheSnapshot = await getDocsFromCache(collection(historyFirestore, "scans"));
      if (cacheSnapshot.size > 0) {
        const cachedData = cacheSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return { success: true, data: cachedData, fromCache: true };
      }

      // If no cache, get fresh data
      const querySnapshot = await getDocs(collection(historyFirestore, "scans"));
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: history };
    } catch (error) {
      console.error("Error getting history:", error);
      return { success: false, message: error.message };
    }
  },

  async deleteHistoryItem(id) {
    try {
      await deleteDoc(doc(historyFirestore, "scans", id));
      return { success: true, message: "Item deleted successfully" };
    } catch (error) {
      console.error("Error deleting item:", error);
      return { success: false, message: error.message };
    }
  },

  // Real-time updates listener
  subscribeToHistoryUpdates(callback) {
    return onSnapshot(collection(historyFirestore, "scans"), (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(history);
    });
  }
};

export default HistoryService; 