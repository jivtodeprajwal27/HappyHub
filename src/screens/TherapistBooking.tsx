import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, Avatar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './list/StackParamList';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type TherapistBookingNavigationProp = StackNavigationProp<StackParamList, 'TherapistBooking'>;

interface Therapist {
  id: string;
  username: string;
  specialization: string;
  rating?: number;
  imageUrl?: string;
  availability: string[];
}

export default function TherapistBooking() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation<TherapistBookingNavigationProp>();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const therapistSnapshot = await firestore().collection('Therapists').get();
        const therapistList = therapistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Therapist[]; // Typecast to Therapist array

        setTherapists(therapistList);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      }
    };

    fetchTherapists();
  }, []);

  const handleBooking = async (therapist: Therapist) => {
    if (selectedDate && therapist.availability.includes(selectedDate)) {
      console.log(`Booking session with ${therapist.username} on ${selectedDate}`);
      
      // Create appointment request
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore().collection('Users').doc(user.uid).get();
          const userData = userDoc.data();
          const username = userData?.username || 'Anonymous';
          
          await firestore().collection('BookingRequests').add({
            therapistId: therapist.id,
            userId: user.uid,
            date: selectedDate,
            status: 'Pending',
            therapistName: therapist.username,
            username : username,
            createdAt: firestore.FieldValue.serverTimestamp(), // Add createdAt field
          });

          navigation.navigate('BookingConfirmation', {
            therapist: {
              name: therapist.username,
              specialization: therapist.specialization,
            },
            date: selectedDate,
          });
        } catch (error) {
          console.error('Error creating appointment:', error);
          Alert.alert('Error', 'Unable to book the appointment. Please try again later.');
        }
      }
    } else {
      Alert.alert('Invalid Date', 'Please select a valid date that matches the therapist’s availability.');
    }
  };


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const renderTherapistItem = ({ item }: { item: Therapist }) => (
    <Card style={styles.therapistCard}>
      <View style={styles.therapistInfo}>
        <Avatar.Image
          source={{ uri: item.imageUrl || 'https://example.com/default-avatar.png' }} // Provide default avatar if no imageUrl
          size={64}
        />
        <View style={styles.therapistDetails}>
          <Text style={styles.therapistName}>{item.username}</Text>
          <Text style={styles.therapistSpecialization}>{item.specialization}</Text>
          {item.rating && <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('TherapistProfile', { therapistId: item.id, username: item.username, specialization: item.specialization })}>
        <Text style={styles.selectDateText}>View Profile</Text>
      </TouchableOpacity>
      <Button
        onPress={() => handleBooking(item)}
        disabled={!selectedDate} // Disable booking if no date is selected
      >
        {selectedDate ? `Book for ${selectedDate}` : 'Select a Date'}
      </Button>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Therapist</Text>
      {therapists.length === 0 ? (
        <Text>No therapists available at the moment.</Text>
      ) : (
        <FlatList
          data={therapists}
          renderItem={renderTherapistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.therapistList}
        />
      )}

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
    color: '#2D3748',
  },
  therapistCard: {
    marginBottom: 16,
    padding: 16,
  },
  therapistInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  therapistDetails: {
    marginLeft: 12,
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  therapistSpecialization: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
  },
  therapistList: {
    paddingBottom: 16,
  },
  selectDateText: {
    marginTop: 8,
    color: '#4299E1',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
