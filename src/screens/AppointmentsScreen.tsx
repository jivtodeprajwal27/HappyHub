import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BookingRequest {
  id: string;
  userId: string;
  userName: string;
  status: string;
  createdAt: firebase.firestore.Timestamp;
}

const AppointmentsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in as a therapist to view requests.');
        return;
      }

      try {
        const snapshot = await firestore()
          .collection('BookingRequests')
          .where('therapistId', '==', user.uid)
          .get();

        const requestsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as BookingRequest[];

        setRequests(requestsList);
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        Alert.alert('Error', 'Failed to fetch booking requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await firestore().collection('BookingRequests').doc(requestId).update({
        status: 'Accepted',
      });
      setRequests(prev =>
        prev.map(request => (request.id === requestId ? { ...request, status: 'Accepted' } : request))
      );
      Alert.alert('Request accepted');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Failed to accept request.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await firestore().collection('BookingRequests').doc(requestId).update({
        status: 'Rejected',
      });
      setRequests(prev =>
        prev.map(request => (request.id === requestId ? { ...request, status: 'Rejected' } : request))
      );
      Alert.alert('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Failed to reject request.');
    }
  };

  const renderRequestItem = ({ item }: { item: BookingRequest }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.userName}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Requested on: {item.createdAt.toDate().toLocaleDateString()}</Text>
      {item.status === 'Pending' ? (
        <View style={styles.buttonContainer}>
          <Button title="Accept" onPress={() => handleAcceptRequest(item.id)} />
          <Button title="Reject" color="red" onPress={() => handleRejectRequest(item.id)} />
        </View>
      ) : (
        item.status === 'Accepted' && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('ChatScreen', {
              requestId: item.id,
              therapistId: auth().currentUser?.uid,
              userId: item.userId,
            })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4299E1" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  if (loading) {
    return <Text>Loading requests...</Text>;
  }

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7FAFC',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  chatButtonText: {
    fontSize: 16,
    color: '#4299E1',
    marginLeft: 8,
  },
});

export default AppointmentsScreen;
