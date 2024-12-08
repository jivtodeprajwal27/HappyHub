import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserData = async (retryCount = 0) => {
    const user = auth().currentUser;
    if (!user) {
      console.error('No user is signed in');
      setError('No user is signed in');
      setLoading(false);
      return;
    }

    try {
      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      if (userDoc.exists) {
        setUserData({ ...userDoc.data(), email: user.email });
      } else {
        setUserData({ username: user.displayName || 'Anonymous', email: user.email });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (retryCount < 3) {
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${backoffTime / 1000} seconds...`);
        setTimeout(() => fetchUserData(retryCount + 1), backoffTime);
      } else {
        setError('Error fetching user data. Please try again later.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => Alert.alert("Logged Out", "You have been logged out successfully"))
      .catch((error) => Alert.alert("Error", error.message));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userData.username || 'Anonymous'}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <Text style={styles.infoLabel}>Role: {userData.role || 'Not assigned'}</Text>
          <Text style={styles.infoLabel}>Member Since: {userData.memberSince || 'Unknown'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          <View style={styles.buttonGroup}>
            <Button title="Settings" onPress={() => { /* Navigate to settings */ }} color="#3498DB" />
            <Button title="Help & Support" onPress={() => { /* Navigate to help */ }} color="#3498DB" />
            <Button title="Log Out" onPress={handleLogout} color="#E74C3C" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    width: '100%',
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  buttonGroup: {
    marginTop: 10,
  },
});
