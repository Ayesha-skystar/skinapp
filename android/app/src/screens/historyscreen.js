import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const HistoryScreen = ({ navigation }) => {
    const historyData = [
        { id: '1', disease: 'Psoriasis', date: '12/3/2023' },
        { id: '2', disease: 'Psoriasis', date: '12/3/2024' }
    ];

    return (
        <View style={styles.container}>
            {/* Show History Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>History</Text>fir
            </TouchableOpacity>
              {/* History List (Appears Below Buttons) */}
            <FlatList
                data={historyData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.disease}>{item.disease}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                     
                )}
            />
            {/* Back to Main Button (Placed Below "Show History") */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EED3EA',
        paddingHorizontal: 20,
        paddingTop: 50 // Space at the top
    },
    button: {
        backgroundColor: '#6c3483',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        marginBottom: 15 // Space between buttons and history
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 8,
        width: '90%',
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    disease: {
        fontWeight: 'bold',
        fontSize: 16
    },
    date: {
        color: 'gray',
        fontSize: 14
    }
});
