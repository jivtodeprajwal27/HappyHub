import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface TherapistProfileProps {
  route: { params: { therapistId: string; username: string; specialization: string } };
  navigation: any; // Replace with the correct type if you have it defined
}

const TherapistProfile: React.FC<TherapistProfileProps> = ({ route, navigation }) => {
  const { therapistId, username, specialization } = route.params;

  const handleSendRequest = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        // Store the request in the 'BookingRequests' collection under the therapist's record
        await firestore().collection('BookingRequests').add({
          therapistId: therapistId,
          therapistName: username,
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          status: 'Pending',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Booking request sent successfully!');
      } catch (error) {
        console.error('Error sending booking request:', error);
        Alert.alert('Failed to send booking request. Please try again.');
      }
    } else {
        Alert.alert('You need to be logged in to send a booking request.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{username}</Text>
        <Text style={styles.specialization}>Specialization: {specialization}</Text>

        <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
          <Text style={styles.buttonText}>Send Booking Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  specialization: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goBackButton: {
    backgroundColor: '#888',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TherapistProfile;
