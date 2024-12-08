import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have react-native-vector-icons installed
import { useNavigation } from '@react-navigation/native';

interface AppointmentRequest {
  id: string;
  therapistId: string;
  userId: string;
  status: string;
  createdAt: Date;
  therapistName: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to view appointments.');
        return;
      }

      try {
        const snapshot = await firestore()
          .collection('BookingRequests')
          .where('userId', '==', user.uid)
          .get();

        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as AppointmentRequest[];

        setAppointments(requests);
      } catch (error) {
        console.error('Error fetching appointment requests:', error);
        Alert.alert('Error', 'Failed to fetch appointment requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const openChat = (appointmentId: string, therapistName: string) => {
    navigation.navigate('ChatScreen', { appointmentId, therapistName });
  };
  

  const renderAppointmentItem = ({ item }: { item: AppointmentRequest }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.therapistName}</Text>
      <Text style={styles.cardStatus}>Status: {item.status}</Text>
      <Text style={styles.cardDate}>Requested on: {item.createdAt?.toDate().toLocaleDateString()}</Text>
      
      {item.status === 'Accepted' && (
        <TouchableOpacity onPress={() => openChat(item.id, item.therapistName)} style={styles.chatIconContainer}>
          <Icon name="chat" size={24} color="#4CAF50" />
          <Text style={styles.chatText}>Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <Text>Loading appointments...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      {appointments.length === 0 ? (
        <Text>No appointment requests found.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardStatus: {
    fontSize: 14,
    color: '#4A5568',
  },
  cardDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  chatIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  chatText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
});
