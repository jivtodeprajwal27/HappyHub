import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TherapistProfileScreen = () => {
  const [profileData, setProfileData] = useState({ specialization: '', certifications: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const doc = await firestore().collection('Therapists').doc(user.uid).get();
        if (doc.exists) {
          setProfileData(doc.data() || { specialization: '', certifications: '' });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      await firestore().collection('Therapists').doc(user.uid).set(profileData, { merge: true });
      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Failed to update profile');
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading profile...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Therapist Profile</Text>

        <Text style={styles.label}>Specialization</Text>
        <TextInput
          style={styles.input}
          value={profileData.specialization}
          onChangeText={text => setProfileData({ ...profileData, specialization: text })}
          placeholder="Enter your specialization"
        />

        <Text style={styles.label}>Certifications</Text>
        <TextInput
          style={styles.input}
          value={profileData.certifications}
          onChangeText={text => setProfileData({ ...profileData, certifications: text })}
          placeholder="Enter certifications"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
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
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TherapistProfileScreen;
